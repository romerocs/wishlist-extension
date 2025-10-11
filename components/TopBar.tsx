
import Logo from './Logo';
import "./index";

function TopBar() {

  return (
    <div>
      <cluster-l justify="space-between" align="center">
        <div><Logo /></div>
        <div>[MENU]</div>
      </cluster-l>
    </div>
  );
}

export default TopBar;