import {useEffect} from "react";
import {useThree} from "react-three-fiber";
export default () => {
    const { camera, gl } = useThree();
    useEffect(() => {
        camera.fov = 45;
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.far = 3 * 200000;
        camera.near = 20;
        camera.position.set(-16000, 500, 11000);
        camera.lookAt(0, 100, 0);
        camera.updateProjectionMatrix();
        const resize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            gl.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener("resize", resize);
        return () => window.removeEventListener("resize", resize);
    }, [camera, gl]);
    return null;
};
