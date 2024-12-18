import {Devvit} from "@devvit/public-api";
import {RoundedImage, RoundedImageProps} from "devvit-helpers";

export type GameImageProps = {
    onExpandPress: () => void | Promise<void>
    onAttributionPress?: () => void | Promise<void>
} & RoundedImageProps & Devvit.Blocks.TextProps & Devvit.Blocks.StackProps & Devvit.Blocks.HasStringChildren;

export const GameImage = (props: GameImageProps) => (
    <zstack alignment="center middle" height={props.imageHeight} width={props.imageWidth}>
        <RoundedImage {...props} />
        <zstack height="100%" width="100%" grow>
            <vstack height={props.imageHeight} alignment="end bottom" padding="none" width="100%">

                <hstack padding="none" alignment="end bottom" width="100%">
                    <spacer grow/>
                    <vstack padding="xsmall">
                        <vstack darkBackgroundColor="rgba(0, 0, 0, 0.5)" lightBackgroundColor="rgba(255, 255, 255, 0.5)" cornerRadius="full" padding="none">
                            <button onPress={props.onExpandPress} appearance="plain" icon="expand-right-fill" size="small"/>
                        </vstack>
                    </vstack>
                </hstack>
            </vstack>

            <vstack height={props.imageHeight} alignment="end bottom" padding="none" width="100%">
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
    </zstack>
);

