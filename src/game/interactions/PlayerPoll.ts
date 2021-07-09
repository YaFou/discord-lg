import Player from "../Player";
import {Stringable} from "../../Translator";
import Poll from "./Poll";

export default class PlayerPoll extends Poll<Player> {
    constructor(title: Stringable, elements: Player[], time: number) {
        super(title, elements, time);
        this.setLabel(player => player.user.displayName);
    }
}
