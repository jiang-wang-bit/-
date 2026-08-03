import {Form,Input,Button,Select,Card,message} from "antd"
import { useParams,useNavigate } from "react-router-dom"
import { useSelector,useDispatch } from "react-redux"
import { updateArticle } from "../../../../store/modules/article"
import { useState,useEffect } from "react"
import { getCategoryList } from "../../../../api/category"
import type { CategoryType } from "../../../../types/category"
import type { RootState } from "../../../../store"
export default function ArticleEdit(){
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {id} = useParams()
  const [form] = Form.useForm()
  const [categories,setCategories] = useState<CategoryType[]>([])
  // 获取文章
  const article = useSelector((state:RootState)=>state.article.list.find(item=>item.id===Number(id)))
    // 当前用户
      const userInfo =
      useSelector(
      (state:RootState)=>state.user.userInfo
      )
  // 获取分类
  useEffect(()=>{
    getCategoryList().then(res=>
      setCategories(res)
    )
  },[])
  // 回填表单
  useEffect(()=>{
    if(article){
      form.setFieldsValue({
        title:article.title,
        categoryId:article.categoryId,
        content:article.content,
        status:article.status
      })
    }
  },[article,form])

        if(!article){
      return (
        <Card>
          文章不存在
        </Card>
      )
      }
      if(
      article?.author!==userInfo?.username
      ){
      return <Card>
        无权编辑该文章
      </Card>
      }

  const submit = (values:any)=>{
    if(!article ) return
    const newArticle = {
      ...article,
      title:values.title,
      categoryId:values.categoryId,
      content:values.content,
      status:values.status
    }
    dispatch(updateArticle(newArticle))
    message.success("修改成功")
    navigate("/user/articles")
  }
  return(
    <div>
      <Card title="编辑文章">
        <Form form={form} onFinish={submit} layout="vertical">
          <Form.Item name="title" label="标题" rules={[{required:true,message:"请输入标题"}]}>
            <Input placeholder="请输入标题"/>
          </Form.Item>
          <Form.Item name="categoryId" label="分类">
            <Select options={categories.map(item=>({
              value:item.id,
              label:item.name
            }))}/>
          </Form.Item>
          <Form.Item name="content" label="内容">
            <Input.TextArea rows={8}/>
          </Form.Item>
          <Form.Item name="status" label="状态">
            <Select options={[{
              value:"发布",
              label:"发布"
            },
            {
              value:"草稿",
              label:"草稿"
            }]}/>
          </Form.Item>
          <Button type="primary" htmlType="submit">保存修改</Button>
        </Form>
      </Card>
    </div>
  )
}