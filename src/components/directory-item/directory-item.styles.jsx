import styled from 'styled-components';

// 💡 Скрываем prop `imageUrl` от попадания в DOM:
export const BackgroundImage = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'imageUrl',
})`
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-image: ${({ imageUrl }) => `url(${imageUrl})`};
  transition: transform 6s cubic-bezier(0.25, 0.45, 0.45, 0.95);
`;

export const Body = styled.div`
  height: 90px;
  padding: 0 25px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px solid black;
  background-color: white;
  opacity: 0.7;
  position: absolute;
  text-transform: uppercase;

  h2 {
    font-weight: bold;
    margin: 0 6px 0;
    font-size: 22px;
    color: #4a4a4a;
    text-transform: uppercase;
      font-family: 'Comic Sans MS', 'Patrick Hand', cursive;

  }

  p {
    font-weight: lighter;
    font-size: 16px;
      font-family: 'Comic Sans MS', 'Patrick Hand', cursive;

  }
`;

export const DirectoryItemContainer = styled.div`
  position: relative;
  min-width: 30%;
  height: 357px;
  flex: 1 1 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid black;
  margin: 0 7.5px 15px;
  overflow: hidden;

  &:hover {
    cursor: pointer;

    ${BackgroundImage} {
      transform: scale(1.1);
    }

    ${Body} {
      opacity: 0.9;
    }
  }

  &.large {
    height: 380px;
  }

  &:first-child {
    margin-right: 7.5px;
  }

  &:last-child {
    margin-left: 7.5px;
  }

 
`;