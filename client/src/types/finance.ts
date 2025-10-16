export interface Invoice {
  id: string
  invoiceNumber: string
  customerId: string
  customerName: string
  customerType: '3pl_customer' | 'supplier' | 'vendor'
  type: 'service' | 'product' | 'transport' | 'storage'
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
  issueDate: Date
  dueDate: Date
  paidDate?: Date
  subtotal: number
  taxRate: number
  taxAmount: number
  discount: number
  total: number
  paidAmount: number
  remainingAmount: number
  currency: 'TRY' | 'USD' | 'EUR'
  items: InvoiceItem[]
  notes?: string
  paymentTerms: string
  paymentMethod?: 'cash' | 'transfer' | 'check' | 'credit_card'
  bankAccount?: string
  createdAt: Date
  updatedAt: Date
}

export interface InvoiceItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  total: number
  taxRate: number
  taxAmount: number
  category: string
  serviceType?: 'storage' | 'handling' | 'transport' | 'customs' | 'insurance'
}

export interface Payment {
  id: string
  invoiceId: string
  customerId: string
  customerName: string
  amount: number
  currency: 'TRY' | 'USD' | 'EUR'
  method: 'cash' | 'transfer' | 'check' | 'credit_card'
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  paymentDate: Date
  reference: string
  bankAccount?: string
  notes?: string
  createdBy: string
  createdAt: Date
}

export interface CustomerAccount {
  id: string
  customerId: string
  customerName: string
  customerType: '3pl_customer' | 'supplier' | 'vendor'
  creditLimit: number
  currentBalance: number
  availableCredit: number
  overdueAmount: number
  lastPaymentDate?: Date
  paymentTerms: string
  currency: 'TRY' | 'USD' | 'EUR'
  status: 'active' | 'suspended' | 'inactive'
  riskLevel: 'low' | 'medium' | 'high'
  contactInfo: {
    email: string
    phone: string
    address: string
  }
  billingInfo: {
    taxNumber: string
    taxOffice: string
    address: string
  }
  createdAt: Date
  updatedAt: Date
}

export interface Contract {
  id: string
  contractNumber: string
  customerId: string
  customerName: string
  type: 'service' | 'storage' | 'transport' | 'fulfillment'
  status: 'draft' | 'active' | 'expired' | 'terminated'
  startDate: Date
  endDate: Date
  renewalDate?: Date
  autoRenewal: boolean
  value: number
  currency: 'TRY' | 'USD' | 'EUR'
  paymentTerms: string
  billingFrequency: 'monthly' | 'quarterly' | 'annually' | 'per_transaction'
  services: ContractService[]
  terms: string
  attachments: string[]
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

export interface ContractService {
  id: string
  name: string
  description: string
  type: 'storage' | 'handling' | 'transport' | 'customs' | 'insurance' | 'packaging'
  pricing: {
    type: 'fixed' | 'per_unit' | 'per_pallet' | 'per_kg' | 'per_m3'
    rate: number
    currency: 'TRY' | 'USD' | 'EUR'
    minCharge?: number
    maxCharge?: number
  }
  conditions: {
    minQuantity?: number
    maxQuantity?: number
    validDays?: string[]
    validHours?: {
      start: string
      end: string
    }
  }
  isActive: boolean
}

export interface Expense {
  id: string
  expenseNumber: string
  category: 'fuel' | 'maintenance' | 'insurance' | 'rent' | 'utilities' | 'salaries' | 'office' | 'other'
  description: string
  amount: number
  currency: 'TRY' | 'USD' | 'EUR'
  taxRate: number
  taxAmount: number
  total: number
  vendorId?: string
  vendorName?: string
  paymentMethod: 'cash' | 'transfer' | 'check' | 'credit_card'
  paymentDate: Date
  dueDate?: Date
  status: 'pending' | 'paid' | 'overdue'
  receipt?: string
  notes?: string
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

export interface Revenue {
  id: string
  revenueNumber: string
  source: 'service' | 'product' | 'transport' | 'storage' | 'other'
  customerId: string
  customerName: string
  amount: number
  currency: 'TRY' | 'USD' | 'EUR'
  taxRate: number
  taxAmount: number
  total: number
  recognitionDate: Date
  invoiceId?: string
  paymentId?: string
  status: 'recognized' | 'collected' | 'deferred'
  notes?: string
  createdBy: string
  createdAt: Date
}

export interface BankAccount {
  id: string
  bankName: string
  accountName: string
  accountNumber: string
  iban: string
  swift?: string
  currency: 'TRY' | 'USD' | 'EUR'
  type: 'checking' | 'savings' | 'business'
  status: 'active' | 'inactive' | 'closed'
  balance: number
  lastReconciliation?: Date
  isDefault: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Transaction {
  id: string
  transactionNumber: string
  type: 'income' | 'expense' | 'transfer' | 'adjustment'
  category: string
  description: string
  amount: number
  currency: 'TRY' | 'USD' | 'EUR'
  bankAccountId: string
  bankAccountName: string
  counterparty?: string
  reference?: string
  transactionDate: Date
  valueDate: Date
  status: 'pending' | 'completed' | 'failed' | 'cancelled'
  balance: number
  notes?: string
  attachments?: string[]
  createdBy: string
  createdAt: Date
}

export interface FinancialReport {
  id: string
  name: string
  type: 'profit_loss' | 'balance_sheet' | 'cash_flow' | 'aging' | 'custom'
  period: {
    start: Date
    end: Date
  }
  parameters: {
    [key: string]: any
  }
  data: {
    [key: string]: any
  }
  status: 'generating' | 'completed' | 'failed'
  generatedAt?: Date
  generatedBy: string
  createdAt: Date
}

export interface AgingReport {
  customerId: string
  customerName: string
  current: number
  days30: number
  days60: number
  days90: number
  over90: number
  total: number
  lastPaymentDate?: Date
  creditLimit: number
  riskLevel: 'low' | 'medium' | 'high'
}

export interface ProfitLossReport {
  period: {
    start: Date
    end: Date
  }
  revenue: {
    service: number
    transport: number
    storage: number
    other: number
    total: number
  }
  costOfGoodsSold: {
    direct: number
    indirect: number
    total: number
  }
  grossProfit: number
  operatingExpenses: {
    salaries: number
    rent: number
    utilities: number
    maintenance: number
    fuel: number
    insurance: number
    office: number
    other: number
    total: number
  }
  operatingProfit: number
  otherIncome: number
  otherExpenses: number
  netProfit: number
  taxes: number
  netProfitAfterTax: number
}

export interface CashFlowReport {
  period: {
    start: Date
    end: Date
  }
  operatingActivities: {
    netIncome: number
    depreciation: number
    accountsReceivable: number
    accountsPayable: number
    inventory: number
    other: number
    total: number
  }
  investingActivities: {
    equipment: number
    vehicles: number
    property: number
    other: number
    total: number
  }
  financingActivities: {
    loans: number
    equity: number
    dividends: number
    other: number
    total: number
  }
  netCashFlow: number
  beginningCash: number
  endingCash: number
}

export interface FinanceStats {
  totalRevenue: number
  totalExpenses: number
  netProfit: number
  grossProfit: number
  operatingMargin: number
  accountsReceivable: number
  accountsPayable: number
  cashBalance: number
  overdueInvoices: number
  overdueAmount: number
  monthlyRevenue: number
  monthlyExpenses: number
  profitGrowth: number
  revenueGrowth: number
  expenseGrowth: number
}
