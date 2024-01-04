import { Label } from "../../@/components/ui/label"
import { Switch } from "../../@/components/ui/switch"
import { useEmuPropsContext } from "../useEmuPropsContext"

export const FullScreenSwitch = () => {
  const { fullscreenOnLoad: value, setFullscreenOnLoad: onCheckedChange } =
    useEmuPropsContext()

  return (
    <div className="flex items-center space-x-2">
      <Label htmlFor="fullscrn">Fullscreen on load</Label>
      <Switch id="fullscrn" checked={value} onCheckedChange={onCheckedChange} />
    </div>
  )
}
