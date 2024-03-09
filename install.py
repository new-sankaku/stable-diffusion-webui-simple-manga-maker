import launch

if not launch.is_installed("pypng"):
    launch.run_pip("install pypng", "requirements for metadata preservation")

if not launch.is_installed("opencv-python"):
    launch.run_pip("install opencv-python", "requirements for metadata preservation")

if not launch.is_installed("numpy"):
    launch.run_pip("install numpy", "requirements for metadata preservation")