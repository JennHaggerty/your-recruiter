import {
  Button,
  Accordion,
  AccordionItem,
  Alert,
  Badge,
  Form,
  Input,
  Link,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from "@heroui/react";
import React, { FormEvent } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  isConnected: boolean;
  handleOpenAi: (e: FormEvent<HTMLFormElement>) => void;
  handleFirecrawl: (e: FormEvent<HTMLFormElement>) => void;
  firecrawlKey?: string;
  openAiKey?: string;
  loading?: boolean;
}

export const Settings = (props: Props) => {
  const {
    isOpen,
    onClose,
    isConnected,
    handleOpenAi,
    handleFirecrawl,
    firecrawlKey,
    openAiKey,
    loading,
  } = props;
  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      className="dark text-white p-5"
    >
      <DrawerContent>
        <DrawerHeader className="text-2xl">Settings</DrawerHeader>

        <DrawerBody>
          <Accordion
            variant="bordered"
            selectionMode="multiple"
            defaultExpandedKeys={["1"]}
          >
            <AccordionItem
              key="1"
              aria-label="MongoDB settings"
              title={
                isConnected ? (
                  "MongoDB"
                ) : (
                  <Badge color="danger" content="1" shape="circle">
                    <div className="pr-4">MongoDB</div>
                  </Badge>
                )
              }
            >
              {isConnected ? (
                <span className="text-green-500">
                  You are connected to MongoDB!
                </span>
              ) : (
                <span className="text-red-500">
                  You are NOT connected to MongoDB. Please notify the site
                  owner.
                </span>
              )}
            </AccordionItem>
            <AccordionItem
              key="2"
              aria-label="Open AI settings"
              title={
                !openAiKey ? (
                  <Badge color="danger" content="1" shape="circle">
                    <div className="pr-8">Open AI</div>
                  </Badge>
                ) : (
                  "Open AI"
                )
              }
            >
              {openAiKey ? (
                <span className="text-success">
                  Open AI Key successfully added.
                </span>
              ) : (
                <div>
                  <span className="text-warning">
                    Open AI is required to use AI features,{" "}
                    <Link
                      href="https://platform.openai.com/api-keys"
                      className="inline"
                    >
                      get a key on the Open AI website.
                    </Link>{" "}
                  </span>
                </div>
              )}
              <Form
                id="add-openai"
                className="flex flex-col gap-3"
                validationBehavior="native"
                onSubmit={handleOpenAi}
              >
                <Alert
                  color="warning"
                  title="Your Open AI key gets erased when you close or refresh this browser."
                  className="my-3"
                />
                <div className="w-full flex flex-col gap-3 mb-5">
                  <Input
                    isRequired
                    variant={"underlined"}
                    errorMessage="Please enter your Open AI key."
                    label="Open AI Key"
                    labelPlacement={"outside"}
                    name="openAiKey"
                    placeholder="sk-proj-***************"
                  />
                  <Button
                    color="primary"
                    type="submit"
                    isLoading={loading}
                    className="w-full"
                  >
                    {openAiKey ? "Update" : "Add"}
                  </Button>
                </div>
              </Form>
            </AccordionItem>
            <AccordionItem
              key="3"
              aria-label="Firecrawl settings"
              title={
                !firecrawlKey ? (
                  <Badge color="danger" content="1" shape="circle">
                    <div className="pr-6">Firecrawl</div>
                  </Badge>
                ) : (
                  "Firecrawl"
                )
              }
            >
              {firecrawlKey ? (
                <span className="text-success">
                  Firecrawl Key successfully added.
                </span>
              ) : (
                <div>
                  <span className="text-warning">
                    Firecrawl is required to use AI features,{" "}
                    <Link href="https://www.firecrawl.dev" className="inline">
                      get a key on the Firecrawl website.
                    </Link>{" "}
                  </span>
                </div>
              )}
              <Form
                id="add-firecrawl-key"
                className="flex flex-col mb-5"
                validationBehavior="native"
                onSubmit={handleFirecrawl}
              >
                <Alert
                  color="warning"
                  title="Firecrawl key is erased when browser is closed or refreshed."
                  className="my-3"
                />

                <div className="w-full flex flex-col gap-3">
                  <Input
                    isRequired
                    variant={"underlined"}
                    errorMessage="Please enter your Firecrawl key."
                    label="Firecrawl Key"
                    labelPlacement={"outside"}
                    name="firecrawlKey"
                    placeholder="fc-***************"
                    className="w-full"
                  />
                  <Button
                    color="primary"
                    type="submit"
                    isLoading={loading}
                    className="w-full"
                  >
                    {firecrawlKey ? "Update" : "Add"}
                  </Button>
                </div>
              </Form>
            </AccordionItem>
          </Accordion>
        </DrawerBody>

        <DrawerFooter>
          <Button variant="flat" onPress={onClose}>
            Close
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
