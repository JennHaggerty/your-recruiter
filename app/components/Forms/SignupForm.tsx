"use client";

import { FormEvent, useState } from "react";
import { Button, Form, Input } from "@heroui/react";
import { EyeFilledIcon } from "../Icons/EyeFilledIcon";
import { EyeSlashFilledIcon } from "../Icons/EyeSlashFilledIcon";

interface Props {
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  loading?: boolean;
}

const SignupForm = (props: Props) => {
  const { handleSubmit, loading } = props;

  const [isVisible, setIsVisible] = useState<boolean>();

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <Form
      className="form flex flex-col gap-4 w-full my-3"
      validationBehavior="native"
      onSubmit={(e) => handleSubmit(e)}
    >
      <Input
        isRequired
        type="email"
        variant={"underlined"}
        labelPlacement={"outside"}
        label="Email"
        name="email"
        placeholder="Enter your email"
        errorMessage="Please enter a valid email."
      />
      <Input
        isRequired
        variant={"underlined"}
        labelPlacement={"outside"}
        label="Password"
        name="password"
        placeholder={`Enter a strong password`}
        errorMessage="Please enter a password."
        type={isVisible ? "text" : "password"}
        endContent={
          <Button
            aria-label="toggle password visibility"
            className="focus:outline-none w-auto mb-3"
            type="button"
            onPress={toggleVisibility}
            isIconOnly
          >
            {isVisible ? (
              <EyeSlashFilledIcon className="pointer-events-none" />
            ) : (
              <EyeFilledIcon className="pointer-events-none" />
            )}
          </Button>
        }
      />
      <span className="text-default-400 text-sm">
        Password must be at least 8 characters long and contain at least 1
        letter, number, and special character.
      </span>
      <Button
        type="submit"
        color={"primary"}
        className="w-full"
        isLoading={loading}
      >
        Sign up
      </Button>
    </Form>
  );
};

export default SignupForm;
