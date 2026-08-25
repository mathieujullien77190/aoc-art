/** @format */

import Camera from "./Camera"
import { CAMERAS } from "./constants"
import * as S from "./UI"

export const Prism = () => (
	<S.Container>
		{CAMERAS.map(camera => (
			<Camera
				key={camera.cameraId}
				label={camera.label}
				publicKey={camera.publicKey}
				cameraId={camera.cameraId}
				zone={camera.zone}
			/>
		))}
	</S.Container>
)
