export default function GenderFilter({
    genderCategories,
    selectedGenderCategory,
    handleGenderCategorySelect
}) {

    return (
        <div className="flex flex-col">
            <p className="text-lg font-semibold mb-2">성별</p>
            {genderCategories.map(genderCategory => (
                <label
                    key={genderCategory}
                    className="inline-flex items-center cursor-pointer space-x-2"
                >
                    <input
                        type="radio"
                        name="genderCategory"
                        value={genderCategory}
                        checked={
                            selectedGenderCategory === genderCategory ||
                            (selectedGenderCategory === null && genderCategory === '전체')
                        }
                        onChange={() => handleGenderCategorySelect(genderCategory)}
                        className="hidden"
                    />
                    <div
                        className={`w-8 h-8 flex items-center justify-center border rounded-full ${
                            selectedGenderCategory === genderCategory
                                ? 'bg-blue-500 text-white border-blue-500'
                                : 'border-gray-300 hover:bg-gray-100'
                        }`}
                    >
                        {selectedGenderCategory === genderCategory && (
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
                    <span className="text-gray-700">{genderCategory}</span>
                </label>
            ))}
        </div>
    )
}