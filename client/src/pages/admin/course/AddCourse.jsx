import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateCourseMutation } from "@/features/api/courseApi";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const AddCourse = () => {
  const [courseTitle, setCourseTitle] = useState("");
  const [category, setcategory] = useState("");

  const [createCourse, { data, isLoading, error, isSuccess }] =
    useCreateCourseMutation();
  const navigate = useNavigate();

  const getSelectedCategory = (value) => {
    setcategory(value);
  };
  const createCourseHandler = async () => {
    await createCourse({ courseTitle, category });
  };

  //for displayinf toast

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "Course created.");
      navigate("/admin/course");
    }
  }, [isSuccess, error]);
  return (
    <div className="flex-1 mx-10 mt-10 ">
      {/* <div className="flex justify-start">
        <h1 className="font-bold text-xl">
          Lets add courses and add some detailes about course.{" "}
        </h1>
        <p className="w-full table-fixed text:sm">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur
          dolor inventore placeat, eius sint magni quisquam non minus aliquam.
          Corporis consectetur tempora aliquid inventore esse! Itaque aperiam
          ipsum repudiandae cupiditate!
        </p>
      </div> */}

      <div className="flex-1 mx-10 mt-10">
        <div className="text-left">
          <h1 className="font-bold text-xl">
            Lets add courses and add some detailes about course.
          </h1>

          <p className="text-sm mt-4 mb-4">
            Lorem ipsum dolor sit amet consectetur adipisicing elit...
          </p>
        </div>
        <div className="space-y-4">
          <div>
            <Label className="mb-2">Title</Label>
            <Input
              type="text"
              name="courseTitle"
              value={courseTitle}
              onChange={(e) => setCourseTitle(e.target.value)}
              placeholder="Course Name"
            />
          </div>

          <div>
            <Label className="mb-2">Category</Label>
            <Select onValueChange={getSelectedCategory}>
              <SelectTrigger className="w-full max-w-48">
                <SelectValue placeholder="Select a Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Category</SelectLabel>
                  <SelectItem value="HTML">HTML</SelectItem>
                  <SelectItem value="CSS">CSS</SelectItem>
                  <SelectItem value="Javascript">Javascript</SelectItem>
                  <SelectItem value="Next JS">Next JS</SelectItem>
                  <SelectItem value="Data Science">Data Science</SelectItem>
                  <SelectItem value="Frontend Development">
                    Frontend Development
                  </SelectItem>
                  <SelectItem value="Full Stack Development">
                    Full Stack Development
                  </SelectItem>
                  <SelectItem value="MERN Stack Development">
                    MERN Stack Development
                  </SelectItem>

                  <SelectItem value="Python">Python</SelectItem>
                  <SelectItem value="React JS">React JS</SelectItem>
                  <SelectItem value="Node JS">Node JS</SelectItem>
                  <SelectItem value="MongoDb">MongoDb</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="text-left">
            <Button variant="outline" onClick={() => navigate("/admin/course")}>
              Back
            </Button>

            <Button disabled={isLoading} onClick={createCourseHandler}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Plaease wait
                </>
              ) : (
                "Create"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCourse;
