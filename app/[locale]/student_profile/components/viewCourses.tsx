import React, { useEffect, useState } from 'react';
import { MultiSelect, MultiSelectChangeEvent } from 'primereact/multiselect';
import Cookies from 'universal-cookie';
import "primereact/resources/themes/lara-light-indigo/theme.css";

interface Course {
  id: number;
  title: string;
  description: string;
  details: string;
  stripeProductId: string | null;
}

function ViewCourses({ onSelectCourses }:any) {
  const cookie = new Cookies();
  const url = process.env.NEXT_PUBLIC_APIURL;
  const token = cookie.get('token');

  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);

  useEffect(() => {
    // Make a GET request to the course/ endpoint
    fetch(`${url}/course/`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.data);
        // Update the courses state with the retrieved data
        setCourses(data.data);
      })
      .catch((error) => {
        console.error('Error fetching courses:', error);
      });
  }, []);
  const handleSelectionChange = (e: MultiSelectChangeEvent) => {
    setSelectedCourses(e.value);
    onSelectCourses(e.value);
  };

  const options = courses?.map((course) => ({
    value: course.id,
    label: course.title,
  }));
  console.log( selectedCourses);

  return (
    <div className="card flex justify-content-center mt-4 w-full">
      <span className="p-float-label text-lg w-full ">
        <MultiSelect
          value={selectedCourses}
          onChange={(e) => setSelectedCourses(e.value)}
          options={options}
          optionLabel="label" // Use "label" instead of "name" for optionLabel
          maxSelectedLabels={3}
          className="w-full md:w-20rem border mt-2"
        />
        <label htmlFor="ms-courses" className='text-[18px] mb-2'>Select Courses:</label>
      </span>
    </div>
  );
}

export default ViewCourses;
