import { SpinnerContainer, SpinnerOverlay } from "./spinner.styles";

const Spinner = () => (
<SpinnerOverlay data-test-id='spinner'>
    <SpinnerContainer />
    </SpinnerOverlay>
);

export default Spinner;