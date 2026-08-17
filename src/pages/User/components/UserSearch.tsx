import{Input,Form,Button,Select,Space} from "antd"
import type { UserSearchParams } from "../../../types/user"
import "../index.scss"
interface UserSearchProps{
  onSearch:(values:UserSearchParams) =>void
}
export default function UserSearch({onSearch}:UserSearchProps){
  const [form] = Form.useForm()
  // 查询
  const handleSearch=()=>{
    const values = form.getFieldsValue()
    onSearch(values)
  }
  // 重置
  const handleReset = ()=>{
    form.resetFields()
    onSearch({})
  }
  return (
    <div className="user-search">
      <Form form={form} layout="inline">
        <Form.Item name="username">
         <Input placeholder="请输入用户名" allowClear/>
        </Form.Item>

        <Form.Item name="email">
          <Input placeholder="请输入邮箱" allowClear/>
        </Form.Item>

        <Form.Item name="role">
          <Select placeholder="角色" style={{width:120}} options={[{label:"admin",value:"admin"},{label:"user",value:"user"}]} allowClear/>
        </Form.Item>

        <Form.Item name="status">
          <Select placeholder="状态" style={{width:120}} options={[{label:"正常",value:"active"},{label:"禁用",value:"disabled"}]} allowClear/>
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" onClick={handleSearch}>查询</Button>
            <Button onClick={handleReset}>重置</Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  )
}