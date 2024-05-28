import { useCallback, useEffect, useRef } from "react"
import { buildEmulator } from "./buildEmulator"
import { Settings } from "./types"
import { defaultPathToData } from "./defaultPathToData"
import { defaultSize } from "./defaultSize"

type Props = { width?: number; height?: number } & Settings

export const EmulatorJS: React.FunctionComponent<Props> = (props) => {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const setIframeGlobals = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const iframeGlobal = iframeRef.current.contentWindow.globalThis

    // @ts-ignore
    iframeGlobal.EJS_player = "#game"

    if (!props.EJS_pathtodata) iframeGlobal.EJS_pathtodata = defaultPathToData
    if (!props.EJS_gameName) iframeGlobal.EJS_gameName = "gameNamePlaceholder"

    for (const key in props) {
      // @ts-ignore
      iframeGlobal[key] = props[key as keyof Settings]
    }
  }, [props])

  useEffect(() => {
    if (!iframeRef.current) return

    const oldDoc = iframeRef.current.contentDocument

    const timer = setInterval(() => {
      if (!iframeRef.current) return

      const newDoc = iframeRef.current.contentDocument
      if (newDoc == oldDoc) return

      setIframeGlobals()
      clearInterval(timer)
    }, 100)
  }, [setIframeGlobals])

  const width = props.width || defaultSize.width
  const height = props.height || defaultSize.height

  const html = buildEmulator({
    loader: `${props.EJS_pathtodata || defaultPathToData}/loader.js`,
    width,
    height,
  }).innerHTML
  
  const handleKeyDown = (e: KeyboardEvent) => {
    window.parent.postMessage({ type: "keydown", key: e.key }, "*");
};

  const handleKeyUp = (e: KeyboardEvent) => {
    window.parent.postMessage({ type: "keyup", key: e.key }, "*");
};

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
        window.removeEventListener("keydown", handleKeyDown);
        window.removeEventListener("keyup", handleKeyUp);
    };
}, []);

  return (
    <iframe
      ref={iframeRef}
      srcDoc={html}
      style={{ border: 0, width: `${width}px`, height: `${height}px` }}
    ></iframe>
  )
}
