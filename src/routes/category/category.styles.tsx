import styled from 'styled-components';

export const CategoryContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr); // 4 карточки в строку
  gap: 20px;
  padding: 10px;
  justify-items: center; // Центрирует карточки по горизонтали

  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, 1fr); // 3 карточки
  }

  @media (max-width: 800px) {
    grid-template-columns: repeat(2, 1fr); // 2 карточки
  }

  @media (max-width: 500px) {
    grid-template-columns: 1fr; // 1 карточка
  }
`;

export const CategoryTitle = styled.h2`
  font-size: 38px;
  margin-bottom: 25px;
  text-align: center;
  font-family: 'Comic Sans MS', 'Patrick Hand', cursive; // ✅ добавлено
`;