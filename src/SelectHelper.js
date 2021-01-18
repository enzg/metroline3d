import { Vector2 } from "three";

var SelectionHelper = (function () {

    function SelectionHelper(selectionBox, renderer, cssClassName) {

        this.element = document.createElement('div');
        this.element.classList.add(cssClassName);
        this.element.style.pointerEvents = 'none';

        this.renderer = renderer;

        this.startPoint = new Vector2();
        this.pointTopLeft = new Vector2();
        this.pointBottomRight = new Vector2();

        this.isDown = false;
        this.isActive = true;

        this.renderer.domElement.addEventListener('pointerdown', pointDown.bind(this));

        this.renderer.domElement.addEventListener('pointermove', pointMove.bind(this));

        this.renderer.domElement.addEventListener('pointerup', pointUp.bind(this));

    }

    function pointDown(event) {
        if (!this.isActive) return
        this.isDown = true;
        this.onSelectStart(event);
    }
    function pointMove(event) {
        if (!this.isActive) return
        if (this.isDown) {
            this.onSelectMove(event);
        }
    }
    function pointUp(event) {
        if (!this.isActive) return
        this.isDown = false;
        this.onSelectOver(event);

    }
    SelectionHelper.prototype.onSelectStart = function (event) {

        if (!this.isActive) return
        this.renderer.domElement.parentElement.appendChild(this.element);

        this.element.style.left = event.clientX + 'px';
        this.element.style.top = event.clientY + 'px';
        this.element.style.width = '0px';
        this.element.style.height = '0px';

        this.startPoint.x = event.clientX;
        this.startPoint.y = event.clientY;

    };

    SelectionHelper.prototype.onSelectMove = function (event) {

        if (!this.isActive) return
        this.pointBottomRight.x = Math.max(this.startPoint.x, event.clientX);
        this.pointBottomRight.y = Math.max(this.startPoint.y, event.clientY);
        this.pointTopLeft.x = Math.min(this.startPoint.x, event.clientX);
        this.pointTopLeft.y = Math.min(this.startPoint.y, event.clientY);

        this.element.style.left = this.pointTopLeft.x + 'px';
        this.element.style.top = this.pointTopLeft.y + 'px';
        this.element.style.width = (this.pointBottomRight.x - this.pointTopLeft.x) + 'px';
        this.element.style.height = (this.pointBottomRight.y - this.pointTopLeft.y) + 'px';

    };

    SelectionHelper.prototype.onSelectOver = function () {
        if (!this.isActive) return
        if (this.element.parentElement)
            this.element.parentElement.removeChild(this.element);

    };
    SelectionHelper.prototype.remove = function () {
        this.renderer.domElement.removeEventListener('pointerdown', pointDown.bind(this));
        this.renderer.domElement.removeEventListener('pointermove', pointMove.bind(this));
        this.renderer.domElement.removeEventListener('pointerup', pointUp.bind(this));
    }

    return SelectionHelper;

})();

export { SelectionHelper };