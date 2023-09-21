export default function ProductHelp() {

    const customers = [
        { id: 1, name: 'Customer 1', email: 'customer1@example.com', content: 'my inquery is....' },
        { id: 2, name: 'Customer 2', email: 'customer2@example.com', content: 'my inquery is....' },
        { id: 3, name: 'Customer 3', email: 'customer3@example.com', content: 'my inquery is....' },
      ];
    
      return (
        <div className="bg-gray-200 p-4">
          <h2 className="text-2xl font-semibold mb-4">고객 게시판</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {customers.map((customer) => (
              <div
                key={customer.id}
                className="bg-white p-4 rounded-lg shadow-md"
              >
                <h3 className="text-xl font-semibold">
                  {customer.name}
                </h3>
                <p className="text-gray-600">{customer.email}</p>
                <p className="text-black">{customer.content}</p>
              </div>
            ))}
          </div>
        </div>
      );
};