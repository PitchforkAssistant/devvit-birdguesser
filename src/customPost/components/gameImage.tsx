import {Devvit} from "@devvit/public-api";
import {RoundedImage, RoundedImageProps} from "devvit-helpers";
import {colors} from "../pages/game/gamePageConstants.js";

export type GameImageProps = {
    onExpandPress?: () => void | Promise<void>
    onAttributionPress?: () => void | Promise<void>
} & RoundedImageProps & Devvit.Blocks.TextProps & Devvit.Blocks.StackProps & Devvit.Blocks.HasStringChildren;

export const GameImage = (props: GameImageProps) => (
    <zstack alignment="center middle" height={props.imageHeight} width={props.imageWidth}>
        <RoundedImage {...props}>
            <zstack grow height="100%" width="100%">
                <vstack alignment="end bottom" height={props.imageHeight} padding="none" width="100%">

                    <hstack alignment="end bottom" padding="none" width="100%">
                        <spacer grow/>
                        <vstack padding="xsmall">
                            {props.onExpandPress && <vstack cornerRadius="full" darkBackgroundColor={colors.backgroundDarkTag} lightBackgroundColor={colors.backgroundLightTag} padding="none">
                                <button appearance="plain" darkTextColor={colors.textDarkTag} icon="expand-right-fill" lightTextColor={colors.textLightTag} onPress={props.onExpandPress} size="small"/>
                            </vstack>}
                        </vstack>
                    </hstack>
                </vstack>

                <vstack alignment="end bottom" height={props.imageHeight} padding="none" width="100%">
                    <hstack alignment="end bottom" padding="none" width="100%">
                        {props.children ? (
                            <vstack padding="xsmall">
                                <hstack cornerRadius="full" darkBackgroundColor={colors.backgroundDarkTag} lightBackgroundColor={colors.backgroundLightTag} padding="none">
                                    <spacer size="xsmall"/>
                                    <text {...props} darkColor={colors.textDarkTag} lightColor={colors.textLightTag} onPress={props.onAttributionPress} selectable={false}>
                                        {props.children}
                                    </text>
                                    <spacer size="xsmall"/>
                                </hstack>
                            </vstack>
                        ) : null}
                        <spacer grow/>
                    </hstack>
                </vstack>
            </zstack>
        </RoundedImage>
    </zstack>
);

