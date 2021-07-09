import Choice from "./Choice";
import Player from "../Player";
import {Stringable} from "../../Translator";

export default class PlayerChoice extends Choice<Player> {
    constructor(title: Stringable, elements: Player[], time: number) {
        super(title, elements, time);
        this.setLabel(player => player.user.displayName);
    }
}
