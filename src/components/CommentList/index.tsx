
import { useSelector } from "react-redux"
import{Card,Avatar,Divider,Empty,Space,Typography,Button} from "antd"
import {
  UserOutlined
} from "@ant-design/icons";
import "./index.scss"
interface Props {
  articleId:number
}
interface CommentType{

 id:number;

 articleId:number;

 username:string;

 content:string;

 status:string;

 time:string;

 parentId:number|null;

}
export default function CommentList({articleId}:Props){
 
 const comments = useSelector((state:any)=>state.comment.list as CommentType [])
 const articleComments = comments.filter(item=>item.articleId===articleId&&item.status==="通过")
  return(
   
  <div className="comment-list">


    <Divider/>


    <Typography.Title level={3}>
      评论 ({articleComments.length})
    </Typography.Title>



    {
      articleComments.length===0

      ?

      <Empty
       description="暂无评论"
      />


      :

      articleComments.map(item=>(

        <Card
          key={item.id}
          style={{
            marginBottom:16
          }}
        >


          <Space
            align="start"
            size="middle"
          >


            {/* 用户头像 */}
            <Avatar
              size={40}
              icon={<UserOutlined/>}
            />


            <div>


              {/* 用户名 */}
              <Typography.Text strong>
                {item.username}
              </Typography.Text>



              {/* 评论内容 */}
              <Typography.Paragraph
                style={{
                  marginTop:8,
                  marginBottom:8
                }}
              >

                {item.content}

              </Typography.Paragraph>



              {/* 时间 */}
              <Typography.Text
                type="secondary"
              >

                {item.time}

              </Typography.Text>



              <br/>


              {/* 后面实现回复 */}
              <Button
                type="link"
                size="small"
              >
                回复
              </Button>


            </div>


          </Space>


        </Card>


      ))
    }


  </div>
  )
}