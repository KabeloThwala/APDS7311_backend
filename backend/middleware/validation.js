const NAME_REGEX = /^[A-Za-z\s'-]{3,60}$/;
const ID_REGEX = /^\d{13}$/;
const ACCOUNT_REGEX = /^\d{8,12}$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,32}$/;
const CURRENCY_REGEX = /^(USD|EUR|GBP|ZAR)$/;
const PROVIDER_REGEX = /^(SWIFT|TransferWise|WesternUnion)$/;
const SWIFT_REGEX = /^[A-Z0-9]{8}(?:[A-Z0-9]{3})?$/;
const ACCOUNT_DEST_REGEX = /^\d{8,20}$/;

const sanitize = (value) => (typeof value === "string" ? value.trim() : value);

const validateFields = (rules, data, res) => {
  const errors = [];

  rules.forEach(({ key, label, test, transform }) => {
    const raw = data[key];
    const value = transform ? transform(raw) : sanitize(raw);

    if (value === undefined || value === null || value === "") {
      errors.push(`${label} is required`);
      return;
    }

    if (test && !test(value)) {
      errors.push(`Invalid ${label}`);
    }

    data[key] = value;
  });

  if (errors.length) {
    res.status(400).json({ message: errors.join(", ") });
    return false;
  }

  return true;
};

export const validateSignupPayload = (req, res, next) => {
  const ok = validateFields(
    [
      { key: "fullName", label: "full name", test: (v) => NAME_REGEX.test(v) },
      { key: "idNumber", label: "ID number", test: (v) => ID_REGEX.test(v) },
      { key: "accountNumber", label: "account number", test: (v) => ACCOUNT_REGEX.test(v) },
      { key: "password", label: "password", test: (v) => PASSWORD_REGEX.test(v) },
    ],
    req.body,
    res
  );

  if (ok) next();
};

export const validateLoginPayload = (req, res, next) => {
  const ok = validateFields(
    [
      { key: "accountNumber", label: "account number", test: (v) => ACCOUNT_REGEX.test(v) },
      { key: "password", label: "password", test: (v) => v.length >= 8 },
    ],
    req.body,
    res
  );

  if (ok) next();
};

export const validatePaymentPayload = (req, res, next) => {
  const ok = validateFields(
    [
      {
        key: "amount",
        label: "amount",
        test: (v) => Number.isFinite(Number(v)) && Number(v) > 0,
        transform: (v) => Number(v),
      },
      { key: "currency", label: "currency", test: (v) => CURRENCY_REGEX.test(v) },
      { key: "provider", label: "provider", test: (v) => PROVIDER_REGEX.test(v) },
      {
        key: "recipientAccount",
        label: "recipient account",
        test: (v) => ACCOUNT_DEST_REGEX.test(v),
      },
      { key: "swiftCode", label: "SWIFT code", test: (v) => SWIFT_REGEX.test(v) },
    ],
    req.body,
    res
  );

  if (ok) {
    if (req.body.reference) {
      req.body.reference = sanitize(req.body.reference).slice(0, 80);
    }
    if (req.body.recipientAccount) {
      req.body.recipientAccount = sanitize(req.body.recipientAccount).replace(/\s+/g, "");
    }
    if (req.body.swiftCode) {
      req.body.swiftCode = sanitize(req.body.swiftCode).toUpperCase();
    }
    if (req.body.currency) {
      req.body.currency = sanitize(req.body.currency).toUpperCase();
    }
    if (req.body.provider) {
      req.body.provider = sanitize(req.body.provider);
    }
    next();
  }
};

export const validateStatusUpdate = (req, res, next) => {
  const allowed = new Set(["verified", "submitted", "rejected"]);
  const status = sanitize(req.body.status);
  if (!allowed.has(status)) {
    res.status(400).json({ message: "Invalid status transition" });
    return;
  }
  req.body.status = status;
  next();
};
