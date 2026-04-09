"use client";

import { useEffect, useState } from "react";
import { Input, Checkbox } from "@/components";

import Image from "next/image";

const BASE_URL = "https://cataas.com/api/";

export default function Home() {
  const [cats, setCats] = useState([]);
  const [tag, setTag] = useState("");
  const [tags, setTags] = useState([]);
  const [allTags, setAllTags] = useState([]);

  const changeTag = (tag) => {
    if(tags.includes(tag)){
      setTags(tags.filter((itag) => itag !== tag))
    } else {
      setTags([...tags, tag])
    }
  }

  
  useEffect(() => {
    fetch(`${BASE_URL}tags`)
      .then((response) => response.json())
      .then((data) => {
        setAllTags(data.slice(10, 20));
      });
  }, []);

  useEffect(() => {
    const commaSeparatedTags = tags.join(',')
    fetch(`${BASE_URL}cats?tags=${commaSeparatedTags}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("data", data);
        setCats(data);
      });
  }, [tags]);


  return (
    <div>
      <div className="max-w-3xl p-4 mx-auto bg-amber-100 flex flex-col items-center justify-center">
        <h1 className="font-bold text-xl">API de Gatos</h1>
        <Input
          className="bg-blue-200"
          onBlur={(e) => setTag(e.target.value)}
        ></Input>

        <div className="flex flex-row">
          <div className="w-32 p-8">
            <ul>
              {allTags.map((tag) => (
                <li key={tag}>
                  <Checkbox 
                  checked={tags.includes(tag)}
                  value={tag}
                  onChange={(e) => changeTag(e.target.value)}
                  label={tag}></Checkbox>
                </li>
              ))}
            </ul>
          </div>
          <div className="">
            <div>
              {cats.map((cat) => (
                <div
                  className="m-4 pb-16 bg-gray-100 border-amber-400 rounded shadow p-4"
                  key={cat.id}
                >
                  <img
                    width="200"
                    src={`https://cataas.com/cat/${cat.id}?position=center`}
                  ></img>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
