import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { Button, Input } from "antd";
import { Link } from "react-router-dom";

const Main: React.FC<any> = () => {
  const [data, setData] = useState([]);
  const [reviews, setReviews] = useState<Array<any>>([]);
  const [contents, setContents] = useState<string>("");

  const fetchData = async () => {
    // alert("TODO 요구사항에 맞추어 기능을 완성해주세요.");
    try {
      const { data } = await axios.get(
        `http://localhost:4000/boards?isDeleted=${false}`
      );
      const reviewData = await axios.get(
        `http://localhost:4000/reviews?isDeleted=${false}`
      );
      setData(data);
      setReviews(reviewData.data);
    } catch (e) {
      alert("일시적인 오류가 발생하였습니다. 고객센터로 연락주세요.");
    }
    // TODO: 데이터베이스에서 boards 리스트 가져오기
    // TODO: 가져온 결과 배열을 data state에 set 하기
    // TODO: 네트워크 등 기타 문제인 경우, "일시적인 오류가 발생하였습니다. 고객센터로 연락주세요." alert
  };

  useEffect(() => {
    // TODO: 해당 useEffect는 최초 마운트시에만 동작하게 제어
    fetchData();
  }, []);

  const handleInputChange = (e: any) => {
    setContents(e.target.value);
  };

  const getLocalUserData = () => {
    const userData = localStorage.getItem("user") as string;
    const user = JSON.parse(userData);
    return user;
  };

  const handleBoardSubmit = async (e: any) => {
    // alert("TODO 요구사항에 맞추어 기능을 완성해주세요.");
    e.preventDefault();
    const user = getLocalUserData();
    const value = {
      email: user.email,
      contents,
      isDeleted: false,
    };

    try {
      await axios.post("http://localhost:4000/boards", value);
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

  const handleDeleteButtonClick = async (id: number) => {
    try {
      await axios.patch(`http://localhost:4000/boards/${id}`, {
        isDeleted: true,
      });
      alert(
        "삭제가 완료되었습니다. 아직 자동 새로고침이 불가하여 수동으로 갱신합니다."
      );
      window.location.reload();
    } catch (e) {
      console.log(e);
      alert("데이터를 삭제하는 데에 오류가 발생하였습니다.");
    }
  };

  const reviewCount = (id: number) => {
    const filteredReviews = reviews.filter((review) => review.boardId === id);
    return filteredReviews.length;
  };
  return (
    <MainWrapper>
      <h1>메인 리스트 페이지</h1>
      <StyledForm onSubmit={handleBoardSubmit}>
        <StyledInput
          placeholder="방명록을 입력해주세요."
          value={contents}
          onChange={handleInputChange}
        />
      </StyledForm>
      <ListWrapper>
        {data.map((item: any, index) => (
          <ListItem key={item.id}>
            <Link to={`/detail/${item.id}`}>
              <span>
                {index + 1}. {item.contents}. {reviewCount(item.id)}
              </span>
            </Link>
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

export default Main;

const MainWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ListWrapper = styled.div`
  width: 50%;
  padding: 10px;
`;

const ListItem = styled.div`
  margin-bottom: 5px;
  display: flex;
  justify-content: space-between;
`;

const StyledInput = styled(Input)`
  width: 50%;
`;

const StyledForm = styled.form`
  width: 100%;
  text-align: center;
`;
