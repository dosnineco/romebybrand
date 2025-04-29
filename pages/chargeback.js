'use client';

import { useState } from 'react';

export default function WriteOffEmailGenerator() {
  const [managerName, setManagerName] = useState('');
  const [transactions, setTransactions] = useState('');
  const [currency, setCurrency] = useState('JMD');
  const [amount, setAmount] = useState('');
  const [merchantList, setMerchantList] = useState('');
  const [emailOutput, setEmailOutput] = useState('');
  const [selectedFindings, setSelectedFindings] = useState([]);

  const findingsOptions = [
    'The customer had never used the merchant before this dispute.',
    'Letter was sent to merchant along with reminders. No response received.',
    'The transactions were not done in a card-present environment but were 3D Secure/UCAF authenticated.',
    'The credit card was replaced.',
    "Transaction appears suspicious",
    'Transaction pattern is inconsistent with customer’s historical spending pattern.',
    'Transaction was disputed within allowable time frame.',
    'The customer card was restricted to FRAUDULENTLY.',
,
  ];

  const toggleFinding = (finding) => {
    setSelectedFindings((prev) =>
      prev.includes(finding)
        ? prev.filter((item) => item !== finding)
        : [...prev, finding]
    );
  };

  const generateEmail = () => {
    const formattedTransactions = transactions
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .join('\n');

    const findingsText = selectedFindings.map((f) => `*\t${f}`).join('\n');

    const email = `Good Day, ${managerName},

Please see below case and advise if we should proceed with write off (Provisional Credit) as we are unable to recover via the chargeback medium.

${formattedTransactions}
\t\t${currency} ${amount}

Findings/Investigations Done:
${findingsText}
*\tMerchant: ${merchantList}
*\tThe findings reveal that the customer can be granted a write-off of $ ${currency} ${amount}

Regards,`;

    setEmailOutput(email);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Write-Off Email Generator</h1>

      <input
        className="w-full border rounded p-2"
        placeholder="Manager's Name (e.g., Mr. Todd or Simone)"
        value={managerName}
        onChange={(e) => setManagerName(e.target.value)}
      />

      <textarea
        className="w-full border rounded p-2"
        placeholder="Enter transaction list, one per line: date, amount, merchant"
        rows={6}
        value={transactions}
        onChange={(e) => setTransactions(e.target.value)}
      />

      <input
        className="w-full border rounded p-2"
        placeholder="Total Amount (e.g., 2571155.00)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <input
        className="w-full border rounded p-2"
        placeholder="Currency (e.g., JMD or USD)"
        value={currency}
        onChange={(e) => setCurrency(e.target.value.toUpperCase())}
      />

      <input
        className="w-full border rounded p-2"
        placeholder="Merchant(s) involved (e.g., Gumdrop, Domino's Pizza)"
        value={merchantList}
        onChange={(e) => setMerchantList(e.target.value)}
      />

      <div>
        <h2 className="font-semibold">Select Findings:</h2>
        {findingsOptions.map((finding) => (
          <label key={finding} className="flex items-center space-x-2 mt-2">
            <input
              type="checkbox"
              checked={selectedFindings.includes(finding)}
              onChange={() => toggleFinding(finding)}
            />
            <span>{finding}</span>
          </label>
        ))}
      </div>

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        onClick={generateEmail}
      >
        Generate Email
      </button>

      {emailOutput && (
        <textarea
          className="w-full border rounded p-2 mt-4"
          rows={10}
          value={emailOutput}
          readOnly
        />
      )}
    </div>
  );
}