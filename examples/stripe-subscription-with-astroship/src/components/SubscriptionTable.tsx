import { useEffect, useState } from "react";

export default function SubscriptionTable() {
  const [subscriptions, setSubscriptions] = useState([]);
  useEffect(() => {
    fetch("/auth/subscriptions", {
      credentials: 'include'
    }).then(async (resp) => {
      console.log("resp", resp);
      if (resp.status === 403) {
        return window.location.href = '/login';
      }
      setSubscriptions(await resp.json());
    });
  }, []);
  console.log("subscriptions", subscriptions);
  return (
    // <div className="flex items-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="px-5 mx-auto w-full lg:container">
        <div className="max-w-screen-lg mx-auto">
          <div className="min-w-full my-10 overflow-x-auto border rounded-md shadow-sm">
            <table className="min-w-full bg-white rounded whitespace-nowrap">
              <thead className="border-b">
                <tr>
                  <th className="px-3 py-4 text-xs font-normal text-left text-gray-500 uppercase align-middle">
                    Name
                  </th>
                  <th className="px-3 py-4 text-xs font-normal text-left text-gray-500 uppercase align-middle">
                    Start Time
                  </th>
                  <th className="px-3 py-4 text-xs font-normal text-left text-gray-500 uppercase align-middle">
                    End Time
                  </th>
                  <th className="px-3 py-4 text-xs font-normal text-left text-gray-500 uppercase align-middle">
                    Price
                  </th>
                  <th className="px-3 py-4 text-xs font-normal text-left text-gray-500 uppercase align-middle">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {subscriptions.length === 0 ? (
                  <tr>
                    <td className="px-3 py-4 text-center text-gray-500" colSpan={5}>
                      No subscriptions yet.
                    </td>
                  </tr>
                ) : (
                  subscriptions.map((subscription: any) => {
                    const price = subscription.prices;
                    const product = price.products;
                    return (
                      <tr key={subscription.id}>
                        <td className="px-3 py-4">{product.name}</td>
                        <td className="px-3 py-4">
                          {subscription.current_period_start}
                        </td>
                        <td className="px-3 py-4">
                          {subscription.current_period_end}
                        </td>
                        <td className="px-3 py-4">
                          {price.unit_amount / 100 + price.currency.toUpperCase()}
                        </td>
                        <td className="px-3 py-4">{subscription.status}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      {/* </div> */}
    </div>
  );
}
