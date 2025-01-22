import {Devvit} from "@devvit/public-api";
import {colors} from "../pages/game/gamePageConstants.js";

export type ImageOverlayProps = {
    onAttributionPress?: () => void | Promise<void>
} & Devvit.Blocks.ImageProps & Devvit.Blocks.TextProps & Devvit.Blocks.HasStringChildren;

export const ImageOverlay = (props: ImageOverlayProps) => (
    <zstack backgroundColor={colors.backgroundOverlay} grow height="100%" width="100%">
        <vstack alignment="start top" grow height="100%" width="100%">
            <image {...props} />
            <spacer grow size="large"/>
        </vstack>
        <vstack alignment="end bottom" height="100%" padding="none" width="100%">
            <hstack alignment="end bottom" padding="none" width="100%">
                {props.children ? (
                    <hstack cornerRadius="full" darkBackgroundColor={colors.backgroundDarkTag} lightBackgroundColor={colors.backgroundLightTag} padding="none">
                        <spacer size="xsmall"/>
                        <text {...props} darkColor={colors.textDarkTag} lightColor={colors.textLightTag} onPress={props.onAttributionPress} selectable={false}>
                            {props.children}
                        </text>
                        <spacer size="xsmall"/>
                    </hstack>
                ) : null}
                <spacer grow/>
            </hstack>
        </vstack>
    </zstack>
);

