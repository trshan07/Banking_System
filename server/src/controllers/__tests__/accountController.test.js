const Account = require('../../models/Account');
const Transaction = require('../../models/Transaction');
const mongoose = require('mongoose');

jest.mock('../../models/Account', () => ({
  findOne: jest.fn(),
  findOneAndUpdate: jest.fn()
}));

jest.mock('../../models/Transaction', () => ({
  findOne: jest.fn(),
  aggregate: jest.fn(),
  create: jest.fn()
}));

jest.mock('mongoose', () => ({
  startSession: jest.fn()
}));

const { createAccount, transferMoney } = require('../accountController');

const response = () => {
  const res = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  return res;
};

const request = (overrides = {}) => ({
  body: {},
  user: { _id: 'user-1' },
  ip: '127.0.0.1',
  get: jest.fn(() => undefined),
  ...overrides
});

describe('account financial controls', () => {
  let session;
  const originalNodeEnv = process.env.NODE_ENV;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.NODE_ENV = 'test';
    session = {
      withTransaction: jest.fn(async (callback) => callback()),
      endSession: jest.fn(async () => {})
    };
    mongoose.startSession.mockResolvedValue(session);
  });

  afterAll(() => {
    process.env.NODE_ENV = originalNodeEnv;
  });

  test('rejects user-supplied opening funds', async () => {
    const req = request({
      body: { accountType: 'checking', initialDeposit: 5000, currency: 'LKR' }
    });
    const res = response();

    await createAccount(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(Account.findOne).not.toHaveBeenCalled();
  });

  test('does not claim an external transfer completed without a provider', async () => {
    const req = request({
      body: { fromAccountId: 'source', amount: 10, transferType: 'external' }
    });
    const res = response();

    await transferMoney(req, res);

    expect(res.status).toHaveBeenCalledWith(501);
    expect(Account.findOneAndUpdate).not.toHaveBeenCalled();
    expect(session.endSession).toHaveBeenCalled();
  });

  test('requires an idempotency key in production', async () => {
    process.env.NODE_ENV = 'production';
    const req = request({
      body: {
        fromAccountId: 'source',
        toAccountId: 'destination',
        amount: 10,
        transferType: 'internal'
      }
    });
    const res = response();

    await transferMoney(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(session.withTransaction).not.toHaveBeenCalled();
  });

  test('commits an internal transfer inside one database transaction', async () => {
    const source = {
      _id: 'source',
      currency: 'LKR',
      dailyTransactionLimit: 10000
    };
    const destination = { _id: 'destination', currency: 'LKR' };
    const debit = { _id: 'source', balance: 90 };
    const credit = { _id: 'destination', balance: 60 };
    const saved = {
      _id: 'transaction-1',
      balanceAfter: { fromAccount: 90, toAccount: 60 }
    };

    Transaction.findOne.mockReturnValue({ session: jest.fn().mockResolvedValue(null) });
    Account.findOne
      .mockReturnValueOnce({ session: jest.fn().mockResolvedValue(source) })
      .mockReturnValueOnce({ session: jest.fn().mockResolvedValue(destination) });
    Transaction.aggregate.mockReturnValue({ session: jest.fn().mockResolvedValue([]) });
    Account.findOneAndUpdate
      .mockResolvedValueOnce(debit)
      .mockResolvedValueOnce(credit);
    Transaction.create.mockResolvedValue([saved]);

    const req = request({
      body: {
        fromAccountId: 'source',
        toAccountId: 'destination',
        amount: '10.00',
        transferType: 'internal'
      },
      get: jest.fn((header) => header === 'Idempotency-Key' ? 'transfer-key-1' : 'test-agent')
    });
    const res = response();

    await transferMoney(req, res);

    expect(session.withTransaction).toHaveBeenCalledTimes(1);
    expect(Account.findOneAndUpdate).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ _id: 'source', balance: { $gte: 10 } }),
      expect.any(Array),
      expect.objectContaining({ session })
    );
    expect(Account.findOneAndUpdate).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ _id: 'destination' }),
      expect.any(Array),
      expect.objectContaining({ session })
    );
    expect(Transaction.create).toHaveBeenCalledWith(
      [expect.objectContaining({
        initiatedBy: 'user-1',
        idempotencyKey: 'transfer-key-1',
        status: 'completed'
      })],
      { session }
    );
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
  });
});
