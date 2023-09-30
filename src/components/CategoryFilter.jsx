export default function CategoryFilter({
    mainCategories,
    selectedCategory,
    handleCategorySelect,
}) {

    return (
        <div className="flex flex-col">
            <p className="text-lg font-semibold mb-2">상품</p>
            {mainCategories.map(category => (
                <label
                    key={category}
                    className="inline-flex items-center cursor-pointer space-x-2"
                >
                    <input
                        type="radio"
                        name="category"
                        value={category}
                        checked={selectedCategory === category || (selectedCategory === null && category === '전체')}
                        onChange={() => handleCategorySelect(category)}
                        className="hidden"
                    />
                    <div
                        className={`w-8 h-8 flex items-center justify-center border rounded-full ${
                            selectedCategory === category || (selectedCategory === null && category === '전체')
                                ? 'bg-blue-500 text-white border-blue-500'
                                : 'border-gray-300 hover:bg-gray-100'
                        }`}
                    >
                        {(selectedCategory === category || selectedCategory === null && category === '전체') && (
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        )}
                    </div>
                    <span className="text-gray-700">{category}</span>
                </label>
            ))}
        </div>
    )
}