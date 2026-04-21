import { Button } from "@chakra-ui/react";

function Dummy() {
  return (
    <div>
      <Button variant={"primary"} isDisabled={false}>
        Click Here
      </Button>
      <Button variant={"secondary"} isDisabled={false}>
        Click Here
      </Button>
      <Button>click here</Button>
      <Button>click</Button>
      <div style={{ borderBottom: "1px solid red" }} />
      <form>
      </form>
    </div>
  );
}

export default Dummy;
