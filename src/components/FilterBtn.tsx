type PropsFilterBtn = {
    active: boolean;
    children: React.ReactNode;
    handleClick: () => void;
}
export default function FilterBtn({active, children, handleClick}: PropsFilterBtn) {
    return (
        <button
            className={`content-center text-left rounded border px-3 py-1 text-base transition bg-gray-100 ${active
                ? "bg-indigo-50 text-red-400"
                : "border-gray-200 hover:bg-gray-300"
                }`}
            onClick={handleClick}
        >
            {children}
        </button>
    );
}