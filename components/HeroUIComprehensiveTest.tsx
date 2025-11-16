/**
 * HeroUI 全组件测试页面
 * 用于验证 HeroUI 是否正确配置和加载
 */

"use client";

import {
  Tabs,
  Tab,
  Button,
  Input,
  Card,
  CardBody,
  CardHeader,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Checkbox,
  RadioGroup,
  Radio,
  Switch,
  Avatar,
  Badge,
  Progress,
  Spinner,
  Chip,
  Divider,
  Link,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
} from "@heroui/react";
import { useState } from "react";
import { Heart } from "lucide-react";

export default function HeroUIComprehensiveTest() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedColor, setSelectedColor] = useState("primary");

  const data = [
    { name: "Tony Reichert", role: "CEO", email: "tony@nextui.org" },
    { name: "Zoey Lang", role: "CTO", email: "zoey@nextui.org" },
    { name: "Jane Fisher", role: "CFO", email: "jane@nextui.org" },
    { name: "William Howard", role: "COO", email: "william@nextui.org" },
    { name: "Lily Collins", role: "Marketing Manager", email: "lily@nextui.org" },
    { name: "Emma Thompson", role: "UI Designer", email: "emma@nextui.org" },
    { name: "Michael Brown", role: "Software Engineer", email: "michael@nextui.org" },
  ];

  return (
    <div className="container mx-auto p-8 space-y-12">
      {/* 页面标题 */}
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">HeroUI 全组件测试</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          用于验证 HeroUI 配置是否正确加载
        </p>
      </div>

      {/* 1. Tabs 组件 */}
      <section>
        <h2 className="text-2xl font-bold mb-4">1. Tabs 组件</h2>
        <div className="bg-content1 rounded-lg p-6">
          <Tabs aria-label="选项卡测试">
            <Tab key="profile" title="用户资料">
              <Card className="mt-4">
                <CardBody>
                  <p className="text-default-500">用户资料信息...</p>
                </CardBody>
              </Card>
            </Tab>
            <Tab key="settings" title="设置">
              <Card className="mt-4">
                <CardBody>
                  <p className="text-default-500">系统设置选项...</p>
                </CardBody>
              </Card>
            </Tab>
            <Tab key="security" title="安全">
              <Card className="mt-4">
                <CardBody>
                  <p className="text-default-500">安全相关设置...</p>
                </CardBody>
              </Card>
            </Tab>
          </Tabs>
        </div>
      </section>

      {/* 2. Button 组件 */}
      <section>
        <h2 className="text-2xl font-bold mb-4">2. Button 组件</h2>
        <div className="bg-content1 rounded-lg p-6 space-y-4">
          <div className="flex flex-wrap gap-4">
            <Button color="primary">Primary</Button>
            <Button color="secondary">Secondary</Button>
            <Button color="success">Success</Button>
            <Button color="warning">Warning</Button>
            <Button color="danger">Danger</Button>
            <Button color="default">Default</Button>
          </div>
          <div className="flex flex-wrap gap-4">
            <Button color="primary" variant="solid">Solid</Button>
            <Button color="primary" variant="bordered">Bordered</Button>
            <Button color="primary" variant="light">Light</Button>
            <Button color="primary" variant="flat">Flat</Button>
            <Button color="primary" variant="ghost">Ghost</Button>
            <Button color="primary" variant="shadow">Shadow</Button>
          </div>
          <div className="flex flex-wrap gap-4">
            <Button color="primary" size="sm">Small</Button>
            <Button color="primary" size="md">Medium</Button>
            <Button color="primary" size="lg">Large</Button>
            <Button color="primary" isLoading>
              Loading
            </Button>
          </div>
        </div>
      </section>

      {/* 3. Input 组件 */}
      <section>
        <h2 className="text-2xl font-bold mb-4">3. Input 组件</h2>
        <div className="bg-content1 rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              type="email"
              label="邮箱"
              placeholder="输入您的邮箱"
              variant="bordered"
            />
            <Input
              type="password"
              label="密码"
              placeholder="输入密码"
              variant="bordered"
            />
            <Input
              label="描述"
              placeholder="输入描述信息"
              variant="bordered"
              className="col-span-2"
            />
            <Input
              label="禁用状态"
              placeholder="不可编辑"
              variant="bordered"
              isDisabled
            />
          </div>
        </div>
      </section>

      {/* 4. Card 组件 */}
      <section>
        <h2 className="text-2xl font-bold mb-4">4. Card 组件</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <div className="flex gap-3">
                <Avatar
                  name="Jane Doe"
                  size="sm"
                  src="https://i.pravatar.cc/150?u=jane-doe"
                />
                <div className="flex flex-col items-start justify-center">
                  <h4 className="text-small font-semibold leading-none text-default-700">
                    Jane Doe
                  </h4>
                  <p className="text-tiny tracking-wide text-default-400">
                    Software Engineer
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardBody>
              <p className="text-small text-default-500">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit...
              </p>
            </CardBody>
          </Card>

          <Card>
            <CardHeader className="pb-0 pt-4 px-4 flex-col items-start">
              <h4 className="text-large font-semibold leading-none text-default-700">
                Pro Version
              </h4>
              <small className="text-default-500">Upgrade to Pro</small>
              <Divider className="mt-3" />
            </CardHeader>
            <CardBody>
              <p className="text-small text-default-500">
                Get unlimited access to all features
              </p>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <Badge content="New" color="success" size="sm">
                <Avatar
                  name="John Doe"
                  size="lg"
                  src="https://i.pravatar.cc/150?u=john-doe"
                />
              </Badge>
            </CardHeader>
            <CardBody>
              <p className="text-small text-default-500">
                New features available
              </p>
            </CardBody>
          </Card>
        </div>
      </section>

      {/* 5. Modal 组件 */}
      <section>
        <h2 className="text-2xl font-bold mb-4">5. Modal 组件</h2>
        <div className="bg-content1 rounded-lg p-6">
          <Button color="primary" onPress={onOpen}>
            打开模态框
          </Button>
          <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1">
                    模态框标题
                  </ModalHeader>
                  <ModalBody>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Nullam auctor, nisl eget ultricies tincidunt, nisl nisl
                      aliquam nisl eget ultricies tincidunt.
                    </p>
                  </ModalBody>
                  <ModalFooter>
                    <Button color="danger" variant="light" onPress={onClose}>
                      关闭
                    </Button>
                    <Button color="primary" onPress={onClose}>
                      确认
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
        </div>
      </section>

      {/* 6. Dropdown 组件 */}
      <section>
        <h2 className="text-2xl font-bold mb-4">6. Dropdown 组件</h2>
        <div className="bg-content1 rounded-lg p-6">
          <div className="flex flex-wrap gap-4">
            <Dropdown>
              <DropdownTrigger>
                <Button variant="bordered">操作菜单</Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="操作选项">
                <DropdownItem key="edit">编辑</DropdownItem>
                <DropdownItem key="duplicate">复制</DropdownItem>
                <DropdownItem key="delete" color="danger">
                  删除
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>

            <Dropdown>
              <DropdownTrigger>
                <Button color="primary">用户菜单</Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="用户菜单">
                <DropdownItem key="profile">个人资料</DropdownItem>
                <DropdownItem key="settings">设置</DropdownItem>
                <DropdownItem key="logout" color="danger">
                  退出登录
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
      </section>

      {/* 7. Checkbox 和 Radio 组件 */}
      <section>
        <h2 className="text-2xl font-bold mb-4">7. Checkbox & Radio 组件</h2>
        <div className="bg-content1 rounded-lg p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Checkbox</h3>
            <div className="flex flex-col gap-2">
              <Checkbox>选项 1</Checkbox>
              <Checkbox defaultSelected>选项 2</Checkbox>
              <Checkbox color="success">选项 3</Checkbox>
              <Checkbox color="warning" isDisabled>
                禁用选项
              </Checkbox>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Radio</h3>
            <RadioGroup label="选择您的爱好">
              <Radio value="reading">阅读</Radio>
              <Radio value="music">音乐</Radio>
              <Radio value="sports">运动</Radio>
              <Radio value="travel" isDisabled>
                旅行（禁用）
              </Radio>
            </RadioGroup>
          </div>
        </div>
      </section>

      {/* 8. Switch 组件 */}
      <section>
        <h2 className="text-2xl font-bold mb-4">8. Switch 组件</h2>
        <div className="bg-content1 rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Switch color="primary" defaultSelected>
                通知
              </Switch>
              <Switch color="secondary" defaultSelected>
                深色模式
              </Switch>
            </div>
            <div className="space-y-4">
              <Switch color="success">自动保存</Switch>
              <Switch color="warning" isDisabled>
                禁用状态
              </Switch>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Avatar 组件 */}
      <section>
        <h2 className="text-2xl font-bold mb-4">9. Avatar 组件</h2>
        <div className="bg-content1 rounded-lg p-6">
          <div className="flex flex-wrap items-center gap-6">
            <Avatar
              name="John Doe"
              src="https://i.pravatar.cc/150?u=john-doe"
              size="sm"
            />
            <Avatar
              name="Jane Doe"
              src="https://i.pravatar.cc/150?u=jane-doe"
              size="md"
            />
            <Avatar
              name="Bob Smith"
              src="https://i.pravatar.cc/150?u=bob-smith"
              size="lg"
            />
            <Avatar name="Alice" size="sm" />
            <Avatar icon={<Heart className="w-4 h-4" />} size="md" color="danger" />
            <Badge content="99+" color="primary" size="sm">
              <Avatar
                name="Emily"
                src="https://i.pravatar.cc/150?u=emily"
                size="lg"
              />
            </Badge>
          </div>
        </div>
      </section>

      {/* 10. Progress 和 Spinner 组件 */}
      <section>
        <h2 className="text-2xl font-bold mb-4">10. Progress & Spinner 组件</h2>
        <div className="bg-content1 rounded-lg p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Progress</h3>
            <div className="space-y-4">
              <Progress
                label="加载中..."
                size="sm"
                value={45}
                color="primary"
                className="max-w-md"
              />
              <Progress
                label="完成度"
                size="md"
                value={70}
                color="success"
                className="max-w-md"
              />
              <Progress
                label="警告状态"
                size="lg"
                value={90}
                color="warning"
                className="max-w-md"
              />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Spinner</h3>
            <div className="flex flex-wrap gap-4">
              <Spinner color="primary" size="sm" label="Small" />
              <Spinner color="secondary" size="md" label="Medium" />
              <Spinner color="success" size="lg" label="Large" />
            </div>
          </div>
        </div>
      </section>

      {/* 11. Chip 组件 */}
      <section>
        <h2 className="text-2xl font-bold mb-4">11. Chip 组件</h2>
        <div className="bg-content1 rounded-lg p-6">
          <div className="flex flex-wrap gap-4">
            <Chip color="primary" variant="solid">主要</Chip>
            <Chip color="secondary" variant="solid">次要</Chip>
            <Chip color="success" variant="solid">成功</Chip>
            <Chip color="warning" variant="solid">警告</Chip>
            <Chip color="danger" variant="solid">危险</Chip>
            <Chip variant="bordered" color="primary">边框</Chip>
            <Chip variant="light" color="secondary">浅色</Chip>
            <Chip variant="flat" color="warning">扁平</Chip>
          </div>
        </div>
      </section>

      {/* 12. Table 组件 */}
      <section>
        <h2 className="text-2xl font-bold mb-4">12. Table 组件</h2>
        <div className="bg-content1 rounded-lg p-6">
          <Table aria-label="用户表格">
            <TableHeader>
              <TableColumn>姓名</TableColumn>
              <TableColumn>职位</TableColumn>
              <TableColumn>邮箱</TableColumn>
            </TableHeader>
            <TableBody emptyContent={"没有用户数据"}>
              {data.map((user, index) => (
                <TableRow key={index}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.email}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      {/* 13. Pagination 组件 */}
      <section>
        <h2 className="text-2xl font-bold mb-4">13. Pagination 组件</h2>
        <div className="bg-content1 rounded-lg p-6">
          <Pagination
            total={10}
            initialPage={1}
            color="primary"
            showShadow
          />
        </div>
      </section>

      {/* 14. Link 组件 */}
      <section>
        <h2 className="text-2xl font-bold mb-4">14. Link 组件</h2>
        <div className="bg-content1 rounded-lg p-6">
          <div className="flex flex-wrap gap-4">
            <Link href="#" color="primary">
              主要链接
            </Link>
            <Link href="#" color="secondary">
              次要链接
            </Link>
            <Link href="#" color="success">
              成功链接
            </Link>
          </div>
        </div>
      </section>

      {/* 底部信息 */}
      <footer className="text-center pt-8 border-t">
        <p className="text-default-500">
          如果以上所有组件都正常显示，说明 HeroUI 配置成功！
        </p>
      </footer>
    </div>
  );
}
