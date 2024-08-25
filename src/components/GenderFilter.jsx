export default function GenderFilter({
    // 성별 카테고리 목록 (여성, 남성, 공용)
    genderCategories,
    // 현재 선택된 성별 카테고리 데이터
    selectedGenderCategory,
    // 사용자가 성별 카테고리 선택 시 실행되는 핸들러 함수 (선택 버튼이 '전체'면 null, 그외 category 값으로 처리)
    handleGenderCategorySelect
}) {

    return (
        <div className="flex flex-col">
            <p className="text-lg font-semibold mb-2">성별</p>

            {/* 성별 카테고리 항목 (여성, 남성, 공용) */}
            {genderCategories.map(genderCategory => (
                <label
                    key={genderCategory} 
                    className="inline-flex items-center cursor-pointer space-x-2"
                >
                    <input
                        type="radio"
                        name="genderCategory"
                        // 현재 선택된 성별 카테고리(selectedGenderCategory)와 이 라디오 버튼의 성별 카테고리(genderCategory)가 일치하는지 확인
                        checked={selectedGenderCategory === genderCategory}
                        // 선택한 genderCategory 값에 따라 selectedGenderCategory 상태 업데이트
                        onChange={() => handleGenderCategorySelect(genderCategory)}
                        className="hidden" 
                    />

                    <div
                        className={`w-8 h-8 flex items-center justify-center border rounded-full ${
                            // 선택 버튼 배경 파란색
                            // 사용자가 아무 카테고리도 선택하지 않았을 시 '전체'가 선택된 것으로 처리
                            (selectedGenderCategory === genderCategory || !selectedGenderCategory && genderCategory === '전체') && (
                                'bg-blue-500 text-white border-blue-500'
                            )}`}
                    >
                        {/* 선택 버튼 체크 표시 */}
                        {(selectedGenderCategory === genderCategory || !selectedGenderCategory && genderCategory === '전체') && (
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
                    
                    {/* 성별 카테고리 항목 (여성, 남성, 공용) */}
                    <span className="text-gray-700">
                        {genderCategory}
                    </span>
                </label>
            ))}
        </div>
    )
}
