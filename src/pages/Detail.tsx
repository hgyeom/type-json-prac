import { Button, Input } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { styled } from "styled-components";

const Detail: React.FC<any> = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [board, setBoard] = useState<{
    email: string;
    contents: string;
    isDeleted: boolean;
    id: number;
  }>();

  const [contents, setContents] = useState();
  const [reviews, setReviews] = useState([]);

  const fetchData = async () => {
    try {
      const { data } = await axios.get(`http://localhost:4000/boards?id=${id}`);
      const reviewData = await axios.get(
        `http://localhost:4000/reviews?boardId=${id}`
      );
      setBoard(data[0]);
      setReviews(reviewData.data);
    } catch {}
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getLocalUserData = () => {
    const userData = localStorage.getItem("user") as string;
    const user = JSON.parse(userData);
    return user;
  };

  const handleDeleteButtonClick = async (id: number) => {
    try {
      await axios.patch(`http://localhost:4000/boards/${id}`, {
        isDeleted: true,
      });
      alert("삭제가 완료되었습니다. 메인화면으로 이동합니다.");
      navigate("/");
    } catch (e) {
      console.log(e);
      alert("데이터를 삭제하는 데에 오류가 발생하였습니다.");
    }
  };

  const handleInputChange = (e: any) => {
    setContents(e.target.value);
  };

  const handleBoardSubmit = async (e: any) => {
    // alert("TODO 요구사항에 맞추어 기능을 완성해주세요.");
    e.preventDefault();
    const user = getLocalUserData();
    const value = {
      boardId: Number(id),
      email: user.email,
      contents,
      isDeleted: false,
    };

    try {
      await axios.post("http://localhost:4000/reviews", value);
      alert(
        "작성이 완료되었습니다. 아직 자동 새로고침이 불가하여 수동으로 갱신합니다."
      );
      window.location.reload();
    } catch (e) {
      alert("일시적인 오류가 발생하였습니다. 고객센터로 연락주세요.");
    }
    // TODO: 자동 새로고침 방지
    // TODO: 이메일과 contents를 이용하여 post 요청 등록(isDeleted 기본값은 false)
    // TODO: 네트워크 등 기타 문제인 경우, "일시적인 오류가 발생하였습니다. 고객센터로 연락주세요." alert
    // TODO: 성공한 경우, "작성이 완료되었습니다. 아직 자동 새로고침이 불가하여 수동으로 갱신합니다." alert
    // TODO: 처리완료 후, reload를 이용하여 새로고침
  };

  if (!board) {
    return <div>로딩중입니다.</div>;
  }

  return (
    <MainWrapper>
      <h1>상세 페이지</h1>
      <ListWrapper>
        <h3>{board.email}</h3>
        <h1>{board.contents}</h1>
        {board.email === getLocalUserData().email && (
          <Button onClick={() => handleDeleteButtonClick(board.id)}>
            삭제
          </Button>
        )}
      </ListWrapper>
      <StyledForm onSubmit={handleBoardSubmit}>
        <StyledInput
          placeholder="댓글을 입력해주세요."
          value={contents}
          onChange={handleInputChange}
        />
      </StyledForm>

      <ListWrapper>
        {reviews
          .filter((item: any) => !item.isDeleted)
          .map((item: any, index) => (
            <ListItem key={item.id}>
              <span>
                {index + 1}. {item.contents}
              </span>
              {item.email === getLocalUserData().email && (
                <Button onClick={() => handleDeleteButtonClick(item.id)}>
                  삭제
                </Button>
              )}
            </ListItem>
          ))}
      </ListWrapper>
    </MainWrapper>
  );
};

export default Detail;

const MainWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ListWrapper = styled.div`
  width: 50%;
  padding: 10px;
`;

const StyledInput = styled(Input)`
  width: 50%;
`;

const StyledForm = styled.form`
  width: 100%;
  text-align: center;
`;

const ListItem = styled.div`
  margin-bottom: 5px;
  display: flex;
  justify-content: space-between;
`;
