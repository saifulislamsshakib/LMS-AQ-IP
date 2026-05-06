import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { useState } from "react";

const Filter = ({ handleFilterChange }) => {
  const [sortByPrice, setSortByPrice] = useState("");

  const selectByPriceHandler = (selectedValue) => {
    setSortByPrice(selectedValue);
    handleFilterChange([], selectedValue);
  };

  return (
    <div className="w-full md:w-[20%]">
      <div className="flex items-center justify-between">
        <h1 className="font-semibold text-lg md:text-xl">Filter Option</h1>

        <Select onValueChange={selectByPriceHandler}>
          <SelectTrigger>
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>

          <SelectContent>
            <SelectGroup>
              <SelectLabel>Sort by price</SelectLabel>
              <SelectItem value="low">Low to High</SelectItem>
              <SelectItem value="high">High to Low</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default Filter;

// import { Checkbox } from "@/components/ui/checkbox";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectLabel,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Separator } from "@/components/ui/separator";
// import React, { useState } from "react";

// const categories = [
//   { id: "Next JS", label: "Next JS" },
//   { id: "Data Science", label: "Data Science" },
//   { id: "Frontend Development", label: "Frontend Development" },
//   { id: "Backend Development", label: "Backend Development" },
//   { id: "Fullstack Development", label: "Fullstack Development" },
//   { id: "Mern Stack Development", label: "Mern Stack Development" },
//   { id: "JavaScript", label: "JavaScript" },
//   { id: "ReactJS", label: "ReactJS" },
//   { id: "Node JS", label: "Node JS" },
//   { id: "MongoDB", label: "MongoDB" },
//   { id: "HTML", label: "HTML" },
//   { id: "CSS", label: "CSS" },
// ];

// const Filter = ({ handleFilterChange }) => {
//   const [selectedCategories, setSelectedCategories] = useState([]);
//   const [sortByPrice, setSortByPrice] = useState("");
//   const handleCategoryChange = (categoryId) => {
//     const newCategory = [categoryId];
//     setSelectedCategories(newCategory);
//     handleFilterChange(newCategory, sortByPrice);
//   };
//   const selectByPriceHandler = (selectedValue) => {
//     setSortByPrice(selectedValue);
//     handleFilterChange(selectedCategories, selectedValue);
//   };
//   return (
//     <div className="w-full md:w-[20%]">
//       <div className="flex items-center justify-between">
//         <h1 className="font-semibold text-lg md: text-xl">Filter Option</h1>
//         <Select onValueChange={selectByPriceHandler}>
//           <SelectTrigger>
//             <SelectValue placeholder="Sort by" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectGroup>
//               <SelectLabel>Sort by price</SelectLabel>
//               <SelectItem value="low">Low to High</SelectItem>
//               <SelectItem value="high"> High to Low</SelectItem>
//             </SelectGroup>
//           </SelectContent>
//         </Select>
//       </div>
//       <Separator className="my-4" />
//       <div>
//         <h1 className="font-semibold mb-2">Category</h1>
//         {categories.map((category) => (
//           <div key={category.id} className="flex items-center space-x-2 my-2">
//             <Checkbox
//               id={category.id}
//               checked={selectedCategories.includes(category.id)}
//               onCheckedChange={(checked) => handleCategoryChange(category.id)}
//             />
//             <Label
//               htmlFor={category.id}
//               className="text-sm font-medium leading-none cursor-pointer"
//             >
//               {category.label}
//             </Label>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Filter;
