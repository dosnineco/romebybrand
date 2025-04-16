import React from "react"

const expensesData = [
    { country: "Jamaica", cost: "$490" },
    { country: "Mexico", cost: "$580" },
    { country: "Colombia", cost: "$520" },
    { country: "Dominican Republic", cost: "$540" },
    { country: "Nicaragua", cost: "$460" },
    { country: "Philippines", cost: "$450" },
    { country: "Thailand", cost: "$500" },
    { country: "Vietnam", cost: "$470" },
    { country: "India", cost: "$430" },
    { country: "Indonesia", cost: "$480" },
    { country: "United States", cost: "$2,000" },
    { country: "Canada", cost: "$1,800" },
    { country: "United Kingdom", cost: "$2,200" },
    { country: "Germany", cost: "$1,700" },
    { country: "France", cost: "$1,800" },
    { country: "Italy", cost: "$1,500" },
    { country: "Spain", cost: "$1,400" },
    { country: "Australia", cost: "$2,000" },
    { country: "New Zealand", cost: "$1,900" },
    { country: "Japan", cost: "$1,800" },
    { country: "South Korea", cost: "$1,600" },
    { country: "China", cost: "$1,200" },
    { country: "Russia", cost: "$1,000" },
    { country: "Brazil", cost: "$800" },
    { country: "Argentina", cost: "$700" },
    { country: "South Africa", cost: "$900" },
    { country: "Egypt", cost: "$600" },
    { country: "Turkey", cost: "$700" },
    { country: "Saudi Arabia", cost: "$1,200" },
    { country: "United Arab Emirates", cost: "$1,500" }
  ];


export default function LivingExpensesTable() {
  return (
    <Card className="max-w-3xl mx-auto mt-10">
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold mb-4">Monthly Living Expenses</h2>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="border-b p-2">Country</th>
              <th className="border-b p-2">Monthly Cost (USD)</th>
            </tr>
          </thead>
          <tbody>
            {expensesData.map((item, index) => (
              <tr key={index}>
                <td className="border-b p-2">{item.country}</td>
                <td className="border-b p-2">{item.cost}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  )
}
