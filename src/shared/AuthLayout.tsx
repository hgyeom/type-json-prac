import { Button } from "antd";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import styled from "styled-components";

const AuthLayout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // alert("TODO 요구사항에 맞추어 기능을 완성해주세요.");
    const userData = localStorage.getItem("user") as string;
    const user = JSON.parse(userData);
    if (!user?.token || !user?.email) {
      alert("토큰 또는 이메일이 없습니다. 로그인해주세요.");
      localStorage.removeItem("user");
      navigate("/auth");
    }
    // TODO: localStorage의 토큰 검색
    // TODO: localStorage의 이메일 검색
    // TODO: 토큰 또는 이메일 중 하나라도 없을 경우 "토큰 또는 이메일이 없습니다. 로그인해주세요." alert
    // TODO: localStorage에 있는 token, email을 제거
    // TODO: "/auth"로 이동
  }, [navigate]);

  const handleLogoutButtonClick = () => {
    // alert("TODO 요구사항에 맞추어 기능을 완성해주세요.");
    const confirmLogout = window.confirm("로그아웃 하시겠습니까?");
    if (confirmLogout) {
      // 사용자가 "예"를 선택한 경우, 로그아웃 처리
      localStorage.removeItem("user");
      alert("로그아웃이 완료되었습니다.");
      navigate("/auth");
    }
    // TODO: "로그아웃 하시겠습니까?" confirm
    // TODO: yes 선택 시, localStorage의 token과 email 제거
    // TODO: "로그아웃이 완료되었습니다" alert
    // TODO: "/auth"로 이동
  };

  return (
    <>
      <StyledHeaderBox>
        <Button onClick={handleLogoutButtonClick}>로그아웃</Button>
      </StyledHeaderBox>
      <Outlet />
    </>
  );
};

export default AuthLayout;

const StyledHeaderBox = styled.div`
  display: flex;
  justify-content: right;
  padding: 10px;
`;
