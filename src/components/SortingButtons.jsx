import Button from "./ui/Button";

export default function SortingButtons({handleSortByPrice, handleSortByDate}) {

    return (
        <div className="mb-4 space-x-2">
            <Button text={'가격 낮은 순'} onClick={() => handleSortByPrice("asc")} />
            <Button text={'가격 높은 순'} onClick={() => handleSortByPrice("desc")} />
            <Button text={'최신 순'} onClick={() => handleSortByDate("latest")} />
            <Button text={'오래된 순'} onClick={() => handleSortByDate("oldest")} />
        </div>
    );
}