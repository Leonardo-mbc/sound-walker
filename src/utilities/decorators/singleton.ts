// export function singleton(ctor: new(...args) => {}) { // TODO: 動くか確認する
export function singleton<T>(ctor: new(...args: any[]) => T) { // TODO: 動くか確認する２
    let instance: {};
    Object.defineProperty(ctor, "instance", {
        get() {
            if(!instance) {
                instance = new ctor();
            }

            return instance;
        }
    });
}
