export default function CategoryFilter({
    // 상품 카테고리 목록 (전체, 원피스, 상의 등)
    mainCategories, 
    // 현재 선택된 제품 카테고리 데이터 
    selectedCategory,
    // 사용자가 카테고리 선택 시 실행 핸들러 (선택 버튼이 '전체'면 null, 그외 category 값으로 처리) 
    handleCategorySelect,
}) {

    return (
        <div className="flex flex-col">
            <p className="text-lg font-semibold mb-2">상품</p>

            {/* 상품 카테고리 항목 ('전체', '원피스', '상의', '하의', '모자', '신발', '기타') */}
            {mainCategories.map(category => (
                <label
                    key={category}
                    className="inline-flex items-center cursor-pointer space-x-2"
                >
                    <input
                        type="radio"
                        name="category"
                        // 현재 선택된 카테고리(selectedCategory)와 이 라디오 버튼의 카테고리(category)가 일치하는지 확인 
                        checked={selectedCategory === category}
                        // 선택한 category 값에 따라 selectedCategory 상태 업데이트
                        onChange={() => handleCategorySelect(category)}
                        className="hidden"
                    />

                    <div
                        className={`w-8 h-8 flex items-center justify-center border rounded-full ${
                            // 선택 버튼 배경 파란색
                            // 사용자가 아무 카테고리도 선택하지 않았을 시 '전체'가 선택된 것으로 처리
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
                    {/* 상품 카테고리 항목 ('전체', '원피스', '상의', '하의', '모자', '신발', '기타') */}
                    <span className="text-gray-700">
                        {category}
                    </span>
                </label>
            ))}
        </div>
    )
}