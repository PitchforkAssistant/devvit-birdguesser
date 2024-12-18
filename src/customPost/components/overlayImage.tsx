import {Devvit} from "@devvit/public-api";

export type OverlayImageProps = {
    onImagePress: () => void | Promise<void>
    onAttributionPress?: () => void | Promise<void>
} & Devvit.Blocks.ImageProps & Devvit.Blocks.TextProps & Devvit.Blocks.HasStringChildren;

export const OverlayImage = (props: OverlayImageProps) => (
    <zstack height="100%" width="100%" grow>
        <vstack alignment="start top" height="100%" width="100%" grow>
            <image {...props} onPress={props.onImagePress} />
            <spacer size="large" grow/>
        </vstack>
        <vstack alignment="end bottom" padding="none" height="100%" width="100%">
            <hstack padding="none" alignment="end bottom" width="100%">
                {props.children ? (
                    <hstack darkBackgroundColor="rgba(0, 0, 0, 0.5)" lightBackgroundColor="rgba(255, 255, 255, 0.5)" cornerRadius="full" padding="none">
                        <spacer size="xsmall"/>
                        <text {...props} selectable={false} onPress={props.onAttributionPress}>
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

