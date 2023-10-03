export default function CategoryFilter({
    mainCategories, // 상품 카테고리 목록 -> 전체, 원피스, 상의...
    selectedCategory, // 선택된 상품 카테고리 -> 유저가 선택한 버튼
    handleCategorySelect, // 상품 카테고리 선택 핸들러 -> 선택 버튼이 '전체'면 null, 그외 category 값으로 처리
}) {

    return (
        <div className="flex flex-col">
            <p className="text-lg font-semibold mb-2">상품</p>

            {/* 상품 카테고리 렌더링 */}
            {mainCategories.map(category => (
                <label
                    key={category}
                    className="inline-flex items-center cursor-pointer space-x-2"
                >
                    <input
                        type="radio"
                        name="category"
                        value={category} // 라디오 버튼 선택 시 값
                        checked={selectedCategory === category}
                        onChange={() => handleCategorySelect(category)}
                        className="hidden"
                    />

                    <div
                        className={`w-8 h-8 flex items-center justify-center border rounded-full ${

                            // 선택 버튼 배경 파란색
                            (selectedCategory === category || !selectedCategory && category === '전체') && (
                                'bg-blue-500 text-white border-blue-500'
                            )}`}
                    >

                        {/* 선택 버튼 체크 표시 */}
                        {(selectedCategory === category || !selectedCategory && category === '전체') && (
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

                    {/* 상품 카테고리 데이터 -> 전체, 원피스, 상의... */}
                    <span className="text-gray-700">{category}</span>
                </label>
            ))}
        </div>
    )
}