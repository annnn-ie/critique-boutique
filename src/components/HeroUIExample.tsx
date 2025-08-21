import React, { useState } from 'react';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Chip,
  Avatar,
  Badge,
  Progress,
  Switch,
  Slider,
  Select,
  SelectItem,
  Textarea,
  Checkbox,
  RadioGroup,
  Radio,
  Tabs,
  Tab,
  Accordion,
  AccordionItem,
  Divider,
  Link,
  Tooltip,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Breadcrumbs,
  BreadcrumbItem,
  Pagination,
  Spinner,
  Skeleton,
  Image,
  Code,
  User,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from '@heroui/react';

export const HeroUIExample: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selected, setSelected] = useState<string>('');
  const [value, setValue] = useState<string>('');
  const [isSelected, setIsSelected] = useState(false);
  const [sliderValue, setSliderValue] = useState<number>(50);

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* HeroUI Navbar */}
        <Navbar className="bg-white/70 backdrop-blur-md border border-neutral-200/50">
          <NavbarContent>
            <NavbarMenuToggle className="sm:hidden" />
            <NavbarBrand>
              <p className="font-bold text-inherit">HeroUI Demo</p>
            </NavbarBrand>
          </NavbarContent>
          <NavbarContent className="hidden sm:flex gap-4" justify="center">
            <NavbarItem>
              <Link color="foreground" href="#">
                Features
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Link color="foreground" href="#">
                Integrations
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Link color="foreground" href="#">
                Pricing
              </Link>
            </NavbarItem>
          </NavbarContent>
          <NavbarContent justify="end">
            <NavbarItem>
              <Button color="primary" variant="flat">
                Get Started
              </Button>
            </NavbarItem>
          </NavbarContent>
        </Navbar>

        {/* HeroUI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="py-4">
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
              <p className="text-tiny uppercase font-bold">Daily Mix</p>
              <small className="text-default-500">12 Tracks</small>
              <h4 className="font-bold text-large">Frontend Radio</h4>
            </CardHeader>
            <CardBody className="overflow-visible py-2">
              <Image
                alt="Card background"
                className="object-cover rounded-xl"
                src="https://nextui.org/images/hero-card-complete.jpeg"
                width={270}
              />
            </CardBody>
          </Card>

          <Card className="py-4">
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
              <p className="text-tiny uppercase font-bold">⚡ Quick Actions</p>
              <h4 className="font-bold text-large">Interactive Elements</h4>
            </CardHeader>
            <CardBody className="overflow-visible py-2">
              <div className="space-y-4">
                <Button color="primary" variant="flat" onPress={onOpen}>
                  Open Modal
                </Button>
                <div className="flex gap-2">
                  <Chip color="success" variant="flat">Success</Chip>
                  <Chip color="warning" variant="flat">Warning</Chip>
                  <Chip color="danger" variant="flat">Error</Chip>
                </div>
                <Progress 
                  aria-label="Loading..." 
                  value={sliderValue} 
                  className="max-w-md"
                />
              </div>
            </CardBody>
          </Card>

          <Card className="py-4">
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
              <p className="text-tiny uppercase font-bold">👥 User Profile</p>
              <h4 className="font-bold text-large">User Information</h4>
            </CardHeader>
            <CardBody className="overflow-visible py-2">
              <User
                name="Jane Doe"
                description="Product Designer"
                avatarProps={{
                  src: "https://i.pravatar.cc/150?u=a04258114e29026702d"
                }}
              />
              <div className="mt-4 space-y-2">
                <Badge content="5" color="danger">
                  <Avatar
                    radius="md"
                    size="lg"
                    src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
                  />
                </Badge>
                <Switch 
                  isSelected={isSelected} 
                  onValueChange={setIsSelected}
                >
                  Notifications
                </Switch>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Form Elements */}
        <Card className="p-6">
          <CardHeader>
            <h3 className="text-xl font-bold">Form Components</h3>
          </CardHeader>
          <CardBody className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                type="email"
                label="Email"
                placeholder="Enter your email"
                variant="bordered"
              />
              <Select
                label="Select an animal"
                placeholder="Select an animal"
                selectedKeys={selected ? [selected] : []}
                onSelectionChange={(keys) => setSelected(Array.from(keys)[0] as string)}
              >
                <SelectItem key="cat" value="cat">
                  Cat
                </SelectItem>
                <SelectItem key="dog" value="dog">
                  Dog
                </SelectItem>
                <SelectItem key="bird" value="bird">
                  Bird
                </SelectItem>
              </Select>
            </div>
            
            <Textarea
              label="Description"
              placeholder="Enter your description"
              variant="bordered"
              value={value}
              onValueChange={setValue}
            />

            <div className="flex gap-4">
              <Checkbox defaultSelected>Remember me</Checkbox>
              <RadioGroup label="Select your favorite">
                <Radio value="buenos-aires">Buenos Aires</Radio>
                <Radio value="sydney">Sydney</Radio>
                <Radio value="san-francisco">San Francisco</Radio>
                <Radio value="london">London</Radio>
              </RadioGroup>
            </div>

            <div>
              <Slider
                label="Volume"
                size="sm"
                step={10}
                color="secondary"
                showSteps={true}
                maxValue={100}
                minValue={0}
                value={sliderValue}
                onChange={(value) => setSliderValue(value as number)}
                className="max-w-md"
              />
            </div>
          </CardBody>
        </Card>

        {/* Interactive Components */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <CardHeader>
              <h3 className="text-xl font-bold">Tabs & Accordion</h3>
            </CardHeader>
            <CardBody>
              <Tabs aria-label="Options">
                <Tab key="photos" title="Photos">
                  <Card>
                    <CardBody>
                      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                    </CardBody>
                  </Card>
                </Tab>
                <Tab key="music" title="Music">
                  <Card>
                    <CardBody>
                      <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                    </CardBody>
                  </Card>
                </Tab>
                <Tab key="videos" title="Videos">
                  <Card>
                    <CardBody>
                      <p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                    </CardBody>
                  </Card>
                </Tab>
              </Tabs>
            </CardBody>
          </Card>

          <Card className="p-6">
            <CardHeader>
              <h3 className="text-xl font-bold">Dropdown & Popover</h3>
            </CardHeader>
            <CardBody className="space-y-4">
              <Dropdown>
                <DropdownTrigger>
                  <Button variant="bordered">
                    Open Menu
                  </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Static Actions">
                  <DropdownItem key="new">New file</DropdownItem>
                  <DropdownItem key="copy">Copy link</DropdownItem>
                  <DropdownItem key="edit">Edit file</DropdownItem>
                  <DropdownItem key="delete" className="text-danger" color="danger">
                    Delete file
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>

              <Popover placement="right">
                <PopoverTrigger>
                  <Button>Open Popover</Button>
                </PopoverTrigger>
                <PopoverContent>
                  <div className="px-1 py-2">
                    <div className="text-small font-bold">Popover Content</div>
                    <div className="text-tiny">This is a popover with some content.</div>
                  </div>
                </PopoverContent>
              </Popover>

              <Tooltip content="This is a tooltip">
                <Button>Hover me</Button>
              </Tooltip>
            </CardBody>
          </Card>
        </div>

        {/* Loading States */}
        <Card className="p-6">
          <CardHeader>
            <h3 className="text-xl font-bold">Loading States</h3>
          </CardHeader>
          <CardBody>
            <div className="flex gap-4 items-center">
              <Spinner color="primary" />
              <Spinner color="secondary" />
              <Spinner color="success" />
              <Spinner color="warning" />
              <Spinner color="danger" />
            </div>
            
            <div className="mt-6 space-y-3">
              <Skeleton className="w-3/5 rounded-lg">
                <div className="h-3 w-3/5 rounded-lg bg-default-300"></div>
              </Skeleton>
              <Skeleton className="w-4/5 rounded-lg">
                <div className="h-3 w-4/5 rounded-lg bg-default-200"></div>
              </Skeleton>
              <Skeleton className="w-2/5 rounded-lg">
                <div className="h-3 w-2/5 rounded-lg bg-default-300"></div>
              </Skeleton>
            </div>
          </CardBody>
        </Card>

        {/* Modal */}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">Modal Title</ModalHeader>
                <ModalBody>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Nullam pulvinar risus non risus hendrerit venenatis.
                    Pellentesque sit amet hendrerit risus, sed porttitor quam.
                  </p>
                  <p>
                    Magna etiam tempor orci eu lobortis elementum nibh.
                    Vulputate mi sit amet mauris commodo quis imperdiet massa.
                  </p>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>
                  <Button color="primary" onPress={onClose}>
                    Action
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
};
