export class CycleTokenStack {


    tokenStack = [];
    hovering = null;
    cancelClick = false;
    clicking = false;
    isTooltipOK = true;
    direction = "fwd";

    keyCycleForward = "[";
    keyCycleBackward = "]";
    showTokenList = "stacked

    constructor() {
      this.tokenStack = [];
      this.hovering = null;
      this.cancelClick = false;
      this.clicking = false;
      this.isTooltipOK = true;
      this.direction = "fwd";

      this.keyCycleForward = "[";
      this.keyCycleBackward = "]";
      this.showTokenList = "stacked";
      this.minClickDelay = 300;
    }
    //- deactvates when targeting
    IsDeactivated(e) {
      const deactive =
        !this.isTooltipOK ||
        !e ||
        e.altKey ||
        e.ctrlKey ||
        e.metaKey ||
        ui.controls.controls.find((n) => n.name === "token").activeTool ===
          "target";
      return deactive;
    }

    //- finds tokens with co-ordinates within the boundaries of the given token
    //- array will be ordered from top to bottom. Top being index 0
    BuildStack(token) {
      this.tokenStack = [];
      if (token) {
        this.tokenStack = canvas.tokens.placeables.filter(
          (t) =>
            t.x + t.w > token.x &&
            t.y + t.h > token.y &&
            t.x < token.x + token.w &&
            t.y < token.y + token.h
        );
      }
      return token;
    }

    Cycle(token, ts, reverse = false) {
      if (!token || ts.length < 2) return token;

      const cycle = function (ts) {
        let item;
        item = ts.shift();
        ts.forEach((t) => {
          t.zIndex = 0;
        });
        item.zIndex = 1;

        ts.push(item);
        return item;
      };

      if (reverse) {
        cycle(ts);
        return cycle(ts);
      } else {
        return cycle(ts);
      }
    }

    ReverseLast(ts) {
      item = ts.splice(ts.length - 2, 1)[0];
      item2 = ts.pop();
      ts.push(item);
      ts.unshift(item2);
      ts.map((x) => {
        x.zIndex = 1;
      });
      ts.map((x) => {
        x.zIndex = 0;
      });
      ts[ts.length - 1].zIndex = 1;
    }

    CycleForward(token) {
      // this.BuildStack(token);
      let reverse = false;
      if (this.direction === "bck") {
        this.tokenStack = this.tokenStack.reverse();
        this.direction = "fwd";
        reverse = true;
      }
      this.hovering = this.Cycle(token, this.tokenStack, reverse);
    }
    CycleBackward(token) {
      // this.BuildStack(token);
      let reverse = false;
      if (this.direction === "fwd") {
        this.tokenStack = this.tokenStack.reverse();
        this.direction = "bck";
        reverse = true;
      }
      this.hovering = this.Cycle(token, this.tokenStack, reverse);
    }

    OnKeyDown(e) {
      if (this.IsDeactivated(e)) return;
      if (this.hovering && e.key === this.keyCycleForward) {
        this.CycleForward(this.hovering);
      }
      if (this.hovering && e.key === this.keyCycleBackward) {
        this.CycleBackward(this.hovering);
      }
    }

    OnMouseMove(e) {
      _CycleTokenStack.cancelClick = true;
    }

    MouseDown(t, f) {
      this.clicking = true;
      this.cancelClick = false;
      t.once("mousemove", this.OnMouseMove);
      setTimeout(() => {
        t.off("mousemove", this.OnMouseMove);
        if (!this.cancelClick) {
          if (f) this.CycleForward(t);
        }
        this.clicking = false;
        this.cancelClick = false;
      }, this.minClickDelay);
    }

    OnMouseDown(e) {
      const c = _CycleTokenStack;
      const oe = e.data.originalEvent;
      if (c.IsDeactivated(oe) || oe.shiftKey) return;
      if (c.clicking) {
        c.cancelClick = true;
        return;
      }
      c.MouseDown(this, true);
    }
  }

  let _CycleTokenStack = new CycleTokenStack();

  onkeydown = function (e) {
    e = e || event;
    _CycleTokenStack.OnKeyDown(e);
  };

  Hooks.on("controlToken", (token, controlled, ...args) => {
    const c = _CycleTokenStack;
    if (controlled) {
      c.isTooltipOK = true;
      token.on("mousedown", c.OnMouseDown);
    } else token.off("mousedown", c.OnMouseDown);
  });

  Hooks.on("hoverToken", (token, hover, ...args) => {
    const c = _CycleTokenStack;
    c.BuildStack(token);

    if (hover) {
      if (!c.clicking && !c.IsDeactivated(event)) {
        c.hovering = token;
      }
    } else {
      if (!c.clicking && c.cancelClick) {
        c.hovering = null;
      }
    }
  });

  Hooks.on("deleteToken", (token, ...args) => {
    _CycleTokenStack.hovering = null;
  });
