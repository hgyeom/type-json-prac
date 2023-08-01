import React from "react";
import { Form, Input, Button, Checkbox } from "antd";
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface SignupFormProp {
  handleSignupSuccess: () => void;
}

const SignupForm: React.FC<SignupFormProp> = ({ handleSignupSuccess }) => {
  const navigate = useNavigate();
  const handleSignup = async (values: any) => {
    try {
      const response = await axios.get(
        `http://localhost:4000/users?email=${values.email}&password=${values.password}`
      );
      const data = response.data[0];
      if (data) {
        alert("이미 존재하는 아이디입니다.");
      } else if (!data) {
        await axios.post("http://localhost:4000/users", values);
        alert(
          "회원가입이 성공적으로 처리되었습니다. 로그인 페이지로 이동합니다."
        );
        handleSignupSuccess();
      } else {
        alert("일시적인 오류가 발생하였습니다. 고객센터로 연락주세요.");
      }
    } catch (e) {
      console.log(e);
    }

    // alert("TODO 요구사항에 맞추어 기능을 완성해주세요.");
    // TODO: 데이터베이스에서 email과 password 기반으로 찾아서 이미 존재하는지 확인 후, 존재하는 경우 "이미 존재하는 아이디입니다." alert
    // TODO: 네트워크 등 기타 문제인 경우, "일시적인 오류가 발생하였습니다. 고객센터로 연락주세요." alert
    // TODO: 성공 시(1), "회원가입이 성공적으로 처리되었습니다. 로그인 페이지로 이동합니다." alert
    // TODO: 성공 시(2), "로그인할 수 있도록 세팅"
  };

  return (
    <FormWrapper onFinish={handleSignup}>
      <Form.Item
        label="이메일"
        name="email"
        rules={[{ required: true, message: "이메일을 입력해주세요." }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="비밀번호"
        name="password"
        rules={[{ required: true, message: "비밀번호를 입력해주세요." }]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item
        label="비밀번호 확인"
        name="confirmPassword"
        rules={[
          { required: true, message: "비밀번호 확인을 입력해주세요." },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("password") === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error("비밀번호가 일치하지 않습니다."));
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item
        name="agreed"
        valuePropName="checked"
        rules={[
          {
            validator: (_, value) =>
              value
                ? Promise.resolve()
                : Promise.reject(
                    new Error("고객정보 이용동의에 체크해주세요.")
                  ),
          },
        ]}
      >
        <Checkbox>고객정보 이용동의</Checkbox>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          회원가입
        </Button>
      </Form.Item>
    </FormWrapper>
  );
};

export default SignupForm;

const FormWrapper = styled(Form)`
  width: 300px;
`;
