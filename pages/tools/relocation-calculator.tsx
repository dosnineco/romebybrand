import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import Head from "next/head";

export default function RelocationCalculator() {
  const [cities, setCities] = useState([]);
  const [currentCity, setCurrentCity] = useState(null);
  const [newCity, setNewCity] = useState(null);
  const [currentCost, setCurrentCost] = useState(3000);
  const [adjustedCost, setAdjustedCost] = useState<number | null>(null);

  useEffect(() => {
    // Fetch cities from Supabase
    const fetchCities = async () => {
      const { data, error } = await supabase.from("cities").select("*").order("country", { ascending: true });
      if (error) {
        console.error("Error fetching cities:", error);
      } else {
        setCities(data);
        setCurrentCity(data[0]);
        setNewCity(data[1]);
      }
    };

    fetchCities();
  }, []);

  const calculateAdjustedCost = () => {
    if (currentCity && newCity) {
      const adjusted =
        (currentCost * newCity.cost_of_living_index) / currentCity.cost_of_living_index;
      setAdjustedCost(adjusted);
    }
  };

  return (
    <>
      <Head>
        <title>Relocation Calculator | Compare Moving Expenses</title>
        <meta
          name="description"
          content="Use our Relocation Calculator to compare expenses between your current city and a new city. Plan your move with confidence."
        />
        <meta
          name="keywords"
          content="relocation calculator, moving expenses, cost of living comparison, city comparison"
        />
        <link
          rel="canonical"
          href="https://www.expensegoose.com/tools/relocation-calculator"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "Relocation Calculator",
              description: "Compare expenses when moving to a new city.",
              applicationCategory: "FinanceApplication",
              operatingSystem: "Web",
              url: "https://www.expensegoose.com/tools/relocation-calculator",
            }),
          }}
        />
      </Head>

      <main className="max-w-screen-md mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-6">Relocation Calculator</h1>

        <p className="text-base text-gray-700 mb-4">
          Use our Relocation Calculator to compare expenses between your current city and a new city. Plan your move with confidence.
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Select Your Cities</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              calculateAdjustedCost();
            }}
            className="space-y-6"
          >
            <div>
              <label htmlFor="currentCity" className="block text-base text-gray-700 mb-2">
                Current City
              </label>
              <select
                id="currentCity"
                value={currentCity?.id || ""}
                onChange={(e) => {
                  const selectedCity = cities.find((city) => city.id === parseInt(e.target.value));
                  if (selectedCity) setCurrentCity(selectedCity);
                }}
                className="w-full p-3 border border-gray-300 rounded-lg"
              >
                {cities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.country}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="newCity" className="block text-base text-gray-700 mb-2">
                New City
              </label>
              <select
                id="newCity"
                value={newCity?.id || ""}
                onChange={(e) => {
                  const selectedCity = cities.find((city) => city.id === parseInt(e.target.value));
                  if (selectedCity) setNewCity(selectedCity);
                }}
                className="w-full p-3 border border-gray-300 rounded-lg"
              >
                {cities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.country}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="currentCost" className="block text-base text-gray-700 mb-2">
                Current Monthly Cost ($)
              </label>
              <input
                id="currentCost"
                type="number"
                value={currentCost}
                onChange={(e) => setCurrentCost(Number(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
              />
            </div>

            <button
              type="submit"
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-300"
            >
              Calculate
            </button>
          </form>
        </section>

        {adjustedCost !== null && (
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Results</h2>
            <div className="p-4 bg-gray-100 rounded-lg">
              <p className="text-base text-gray-700">
                Adjusted Monthly Cost in {newCity?.country}:{" "}
                <span className="font-bold text-blue-600">${adjustedCost.toFixed(2)}</span>
              </p>
            </div>
          </section>
        )}

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Tips for Relocating</h2>
          <ul className="list-disc list-inside mb-4 text-base">
            <li>Research the cost of living in the new city before making a decision.</li>
            <li>Consider additional expenses like moving costs and utility setup fees.</li>
            <li>Plan your budget to account for unexpected expenses during the move.</li>
            <li>Look for ways to save, such as downsizing or finding discounts on moving services.</li>
          </ul>
        </section>
      </main>
    </>
  );
}