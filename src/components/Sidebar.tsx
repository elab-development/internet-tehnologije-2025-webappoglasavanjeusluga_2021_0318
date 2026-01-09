import {FullCategoryDto} from "@/shared/types";
import FilterBtn from "./FilterBtn";

type Props = {
    categoryId: number | null;
    setCategoryId: (value: number | null) => void;
    categories: FullCategoryDto[];
    setSearch: (value: string) => void,
};

export default function Sidebar({ categoryId, setCategoryId, categories, setSearch }: Props) {
    return (
        <aside className="w-full md:w-64 shrink-0" >
                {/* Categories filter buttons */}
                <div className="grid gap-2">
                    <FilterBtn
                        active={categoryId === null}
                        handleClick={() => 
                        {setCategoryId(null);
                         setSearch("");
                        }}
                    >
                        <p className="p-2">Sve usluge</p>
                    </FilterBtn>
                    {categories.map((c) => (
                        <FilterBtn
                            key={c.id}
                            active={categoryId === c.id}
                            handleClick={() => 
                            {   setCategoryId(c.id);
                                setSearch("");
                            }}
                        >
                          <div className="flex flex-row items-center gap-2">
                                <img src={c.icon} alt="ikonica" className="w-10 h-10" /> 
                                <p>{c.name}</p>
                            </div> 
                        </FilterBtn>
                    ))}
                </div>

        </aside>
    )
}