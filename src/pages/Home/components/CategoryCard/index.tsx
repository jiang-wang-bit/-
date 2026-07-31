import {Tag} from "antd"


interface Props{

category:{
 name:string
}}


export default function CategoryCard({
 category}:Props){


      return(
      <Tag
      color="blue"
      >
      {category.name}
      </Tag>
      )
      }