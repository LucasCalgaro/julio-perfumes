'use client'
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";

const FilterBar = () => {
    return (
        <>
        <ToggleGroup type="single" className="gap-4 ">
            <ToggleGroupItem value="Masculino" size="xs">Masculino</ToggleGroupItem>
            <ToggleGroupItem value="Feminino" size="xs">Feminino</ToggleGroupItem>
            <ToggleGroupItem value="Unisex" size="xs">Unisex</ToggleGroupItem>
        </ToggleGroup>
        </>
    );
}
 
export default FilterBar;