import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Chip,
  DrawerFooter,
  Button,
  Alert,
} from "@heroui/react";
import "./LegendDrawer.css";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const LegendDrawer = (props: Props) => {
  const { isOpen, onClose } = props;
  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      className="dark text-white p-5"
    >
      <DrawerContent>
        <DrawerHeader className="text-2xl">
          Understanding the color code.
        </DrawerHeader>

        <DrawerBody>
          <div>
            <dl className="color-legend flex flex-col gap-3">
              <dt>Blue is the action color.</dt>
              <dd>
                <ul className="legend-list">
                  <li>
                    <Chip variant="flat" color="primary">
                      Flat blue buttons
                    </Chip>{" "}
                    open drawers and modals.
                  </li>

                  <li>
                    <Chip color="primary">Bright blue buttons</Chip> submit a
                    form.
                  </li>

                  <li>
                    <span className="text-primary">Blue text</span> represent a
                    link you may click on.
                  </li>
                </ul>
              </dd>

              <dt>Purple is the color of AI.</dt>
              <dd>
                <ul>
                  <li>
                    <Chip variant="flat" color="secondary">
                      Purple buttons
                    </Chip>{" "}
                    will perform an AI action.
                  </li>

                  <li>
                    <Chip color="secondary">
                      <span className="text-success">$</span> Purple buttons
                    </Chip>{" "}
                    with a currency symbol require funding to perform the AI
                    action.
                  </li>
                </ul>
              </dd>

              <dt>Gray is Neurtral.</dt>
              <dd>
                <ul>
                  <li>
                    <Chip variant="flat">Gray buttons</Chip> close modals and
                    forms, and may be used when side-by-side elements are the
                    same color.
                  </li>

                  <li>
                    <Chip variant="bordered">Gray buttons</Chip> clear and reset
                    forms.
                  </li>
                </ul>
              </dd>

              <dt>Green is success or cash money!</dt>
              <dd>
                <ul>
                  <li>
                    <Chip variant="flat" color="success">
                      Green buttons
                    </Chip>{" "}
                    represent a financial transaction.
                  </li>

                  <li>
                    <span className="text-success">Green text</span>, a{" "}
                    <Chip variant="bordered" color="success">
                      green outline
                    </Chip>{" "}
                    or{" "}
                    <Chip color="success" radius="none">
                      green box
                    </Chip>
                    , is a successful transaction.
                  </li>
                </ul>
              </dd>

              <dt>Red is an Error.</dt>
              <dd>
                <ul>
                  <li>
                    <Chip variant="flat" color="danger">
                      Red buttons
                    </Chip>{" "}
                    represent a delete action, <b>use caution</b>.
                  </li>

                  <li>
                    <span className="text-danger">Red text</span>, in a{" "}
                    <Chip variant="bordered" color="danger">
                      red outline
                    </Chip>{" "}
                    or{" "}
                    <Chip color="danger" radius="none">
                      red box
                    </Chip>
                    , is an indication of an error.
                  </li>
                </ul>
              </dd>

              <dt>Yellow is a Warning Color.</dt>
              <dd>
                <ul>
                  <li>
                    <span className="text-warning">Yellow text</span>, in a{" "}
                    <Chip variant="bordered" color="warning">
                      yellow outline
                    </Chip>{" "}
                    or{" "}
                    <Chip color="warning" radius="none">
                      yellow box
                    </Chip>
                    , is conveying a warning.
                  </li>
                </ul>
              </dd>
            </dl>
          </div>
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

export default LegendDrawer;
